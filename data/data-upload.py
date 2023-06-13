import psycopg2
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
import json
import jmespath
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import tiktoken
import re
import openai
import numpy as np
import os
from dotenv import load_dotenv
from pgvector.psycopg2 import register_vector

load_dotenv()

def num_tokens_from_string(string: str, encoding_name: str) -> int:
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.get_encoding(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens

class PGChunk:
    def __init__(self, title, url, content, content_length, content_tokens, embedding):
        self.page_title = title
        self.page_url = url
        self.content = content
        self.content_length = content_length
        self.content_tokens = content_tokens
        self.embedding = embedding

class PGPage:
    def __init__(self, title, url, content, length, tokens, chunks):
        self.title = title
        self.url = url
        self.content = content
        self.length = length
        self.tokens = tokens
        self.chunks = chunks

def get_title(driver):
    #print(driver.page_source)
    try :
        directory = driver.find_elements(By.CSS_SELECTOR, "script[type='application/ld+json']") 
        directory_string = []
        for dir in directory:
            directory_string.append(dir.get_attribute("innerHTML"))
        directory_string = '{}'.join(directory_string)
        directory_dict = json.loads(directory_string)
        path = jmespath.search('itemListElement[].name', directory_dict)
        return ' \\ '.join(path)
    except:
        try :
            return driver.find_elements(By.TAG_NAME, 'h1')[0].text
        except :
            return driver.current_url.split('https://docs.aws.amazon.com/')[1]
    

def get_content(driver):
    lines = []
    for title in driver.find_elements(By.TAG_NAME, 'h1'):
        curr = title.text
        pos = title.location['y']
        if curr:
            curr = curr.strip()
            curr = "@@@^^^" + curr + "^^^@@@"
            lines.append((curr, pos))

    for subtitle in driver.find_elements(By.TAG_NAME, 'h2'):
        curr = subtitle.text
        pos = subtitle.location['y']
        if curr:
            curr = curr.strip()
            curr = "@@@^^" + curr + "^^@@@"
            lines.append((curr, pos))
    
    for subsubtitle in driver.find_elements(By.TAG_NAME, 'h3'):
        curr = subsubtitle.text
        pos = subsubtitle.location['y']
        alpha = re.search('[a-zA-Z]', curr)
        if curr and alpha:
            curr = curr.strip()
            curr = "@@@^" + curr + "^@@@"
            lines.append((curr, pos))

    for para in driver.find_elements(By.TAG_NAME, 'p'):
        curr = para.text
        pos = para.location['y']
        if curr:
            curr = curr.strip()
            if curr and len(curr) > 0:
                if (curr[-1] != '.'):
                    curr = curr + "."
                lines.append((curr, pos))

    for code in driver.find_elements(By.TAG_NAME, 'pre'):
        curr = "".join(code.text.split())
        pos = code.location['y']
        alpha = re.search('[a-zA-Z]', curr)
        if curr and alpha:
            curr = curr.strip()
            curr = "@@@~~" + curr + "~~@@@"
            lines.append((curr, pos))

    lines.sort(key = lambda x: x[1])
    if len(lines) > 0:
        lines = list(zip(*lines))[0]
        return ' '.join(lines)
    else:
        return None


def chunk_page(content):
    CHUNK_SIZE = 200
    CHUNK_MAX = 250
    page_text_chunks = [];
    if num_tokens_from_string(content, "cl100k_base") > CHUNK_SIZE:
        split = '@@@'.join(content.split('. ')).split('@@@')
        chunkText = ""
        for sentence in split:
            sentence = sentence.strip()
            if len(sentence) == 0: 
                continue
            sentence_tokens = num_tokens_from_string(sentence, "cl100k_base");
            if sentence_tokens > CHUNK_SIZE:
                continue
            chunk_tokens = num_tokens_from_string(chunkText, "cl100k_base");
            if chunk_tokens + sentence_tokens > CHUNK_SIZE:
                page_text_chunks.append(chunkText.strip());
                chunkText = "";
            if re.search('[a-zA-Z]', sentence[-1]):
                chunkText += sentence + '. '
            else:
                chunkText += sentence + ' '
        page_text_chunks.append(chunkText.strip());
    else:
        page_text_chunks.append(content.strip())
    
    if len(page_text_chunks) > 2:
        last_elem = num_tokens_from_string(page_text_chunks[-1], "cl100k_base")
        second_to_last_elem = num_tokens_from_string(page_text_chunks[-2], "cl100k_base")
        if last_elem + second_to_last_elem < CHUNK_MAX:
            page_text_chunks[-2] += page_text_chunks[-1]
            page_text_chunks.pop()
    
    return page_text_chunks


def embed_chunk(title, url, content):
    embedding = openai.Embedding.create(
        input = content, 
        model = 'text-embedding-ada-002')['data'][0]['embedding']
    chunk = PGChunk(title, url, content, len(content), num_tokens_from_string(content, "cl100k_base"), embedding)
    return chunk

def make_page(cur, driver, url):
    driver.get(url)
    title = get_title(driver)
    content = get_content(driver)
    if content == None:
        return
    page_text_chunks = chunk_page(content)

    for chunk in page_text_chunks:
        pg_chunk = embed_chunk(title, url, chunk)
        embedding = np.array(pg_chunk.embedding)
        sql = 'INSERT INTO ' + os.getenv('POSTGRES_TABLE_NAME') + '(page_title, page_url, content, content_length, content_tokens, embedding) VALUES (%s, %s, %s, %s, %s, %s);'
        print(pg_chunk.page_title)
        cur.execute(sql, (
            pg_chunk.page_title,
            pg_chunk.page_url,
            pg_chunk.content,
            str(pg_chunk.content_length),
            str(pg_chunk.content_tokens),
            embedding))
       

def main():
    options = webdriver.ChromeOptions()
    options.add_argument("--incognito")
    options.add_argument("--disable-site-isolation-trials") 
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options, service=Service(ChromeDriverManager().install()))
    openai.api_key = os.getenv('OPENAI_API_KEY')
    conn = None

    try :
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(
            host = os.getenv('POSTGRES_HOST'),
            database = os.getenv('POSTGRES_DB_NAME'),
            user = os.getenv('POSTGRES_USERNAME'),
            password = os.getenv('POSTGRES_PASSWORD')
        )
        register_vector(conn)

        cur = conn.cursor()
        
        additional = open("additional.txt", "r")
        for url in additional.readlines():
            make_page(cur, driver, url.rstrip())
        additional.close()

        
        conn.commit()

        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')

if __name__ == "__main__":
    main()
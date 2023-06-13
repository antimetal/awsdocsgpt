from fastapi import APIRouter
import os
import openai
import numpy as np
from pgvector.asyncpg import register_vector
from app.schemas import query, search_response, chat_response
import app.exceptions as exceptions
from fastapi import Request

router = APIRouter()


@router.post(
    "/chat",
    response_model=chat_response,
    summary="Get response from OpenAI Chat Completion with prompt string and result count",
    response_description="Answer (string which represents the completion) and sources used",
)
async def chat_handler(request: Request, query: query):
    rows = await helper(request, query)

    pages = []
    content = (
        """Please answer the following prompt truthfully and as accurately as possible. 
                Use the following sources (which shall be denoted with a SOURCE TITLE and SOURCE CONTENT). 
                Try to not directly copy the sources word-for-word. Remember, you help developers with their questions 
                about the AWS documentation and MUST USE THE SOURCES to the best of your ability. You do not have to explicity
                mention the source names and which sources you used in your answer.
                
                Here is the PROMPT: """
        + query.prompt
        + "\n\n Here are the SOURCES: \n\n"
    )
    for row in rows:
        dic = dict(row)
        pages.append(dic)
        content += "SOURCE TITLE: " + dic["page_title"] + "\n"
        content += "SOURCE CONTENT: " + dic["content"]

    messages = [
        {
            "role": "system",
            "content": "You are a helpful and concise assistant that helps developers with their questions about the AWS documentation. Respond in approximately 3-5 sentences.",
        },
        {"role": "user", "content": content},
    ]
    try:
        res = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
        reply = res["choices"][0]["message"]["content"]
    except:
        raise exceptions.InvalidChatCompletionException

    return chat_response(answer=reply, sources=pages)


@router.post(
    "/search",
    response_model=search_response,
    summary="Get chunks from Postgres DB with prompt string and result count",
    response_description="Sources that match the prompt (in a list)",
)
async def search_handler(request: Request, query: query):
    rows = await helper(request, query)
    response = []
    for row in rows:
        response.append(dict(row))

    return search_response(sources=response)


async def helper(request: Request, query: query):
    try:
        embedding = openai.Embedding.create(
            input=query.prompt, model="text-embedding-ada-002"
        )["data"][0]["embedding"]
        sql = "SELECT * FROM " + os.getenv("POSTGRES_SEARCH_FUNCTION") + "($1, $2, $3)"
    except:
        raise exceptions.InvalidPromptEmbeddingException
    
    try:
        res = await request.app.state.conn.fetch(
            sql, np.array(embedding), query.similarity_threshold, query.results
        )
    except:
        raise exceptions.InvalidPostgresQueryException

    return res

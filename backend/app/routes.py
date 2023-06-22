from fastapi import APIRouter
import os
import openai
import numpy as np
from app.schemas import query, search_response, chat_response
import app.exceptions as exceptions
from fastapi import Request
import logging

router = APIRouter()
_logger = logging.getLogger(__name__)

@router.post(
    "/chat",
    response_model=chat_response,
    summary="Get response from OpenAI Chat Completion with prompt string and result count",
    response_description="Answer (string which represents the completion) and sources used",
)
async def chat_handler(request: Request, query: query):
    _logger.info({"message": "Calling Chat Endpoint"})
    rows = await helper(request, query)

    pages = []
    content = (
        f"""Please answer the following IMPORTANT PROMPT truthfully and as accurately as possible. 
                Use the following sources (which shall be denoted with a SOURCE TITLE and SOURCE CONTENT). 
                Try to not directly copy the sources word-for-word. Remember, you help developers with their questions 
                about the AWS documentation and TRY TO USE THE SOURCES AS CONTEXT to the best of your ability. However, you want to
                mainly focus on answering the user prompt. Do not randomly use the sources that have nothing to
                do with the question asked by the user. You do not have to explicity
                mention the source names and which sources you used in your answer.
                AGAIN PLEASE MAKE THE RESPONSE A {query.sentences.upper()} {query.sentences.upper()} {query.sentences.upper()} LENGTH THIS IS VERY IMPORTANT!!!
                
                Here is the IMPORTANT PROMPT: """
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
            "content": f"""You are a helpful and concise assistant that helps developers with their questions about the AWS documentation. 
                       In your responses, when you want to include a header, include it like: # [your header].
                       when you want to include a sub-header, include it like: ## [your sub-header].
                       when you want to include a piece of code, include it like: ```[your entire code bit]```.
                       For bold text, just render it like **bold text**. Render ordered/unordered lists in Markdown. 
                       For links, render as [link title](https://www.example.com).
                       Essentially just give your entire response as a Markdown document.
                       PLEASE MAKE THE RESPONSE A {query.sentences.upper()} {query.sentences.upper()} {query.sentences.upper()} LENGTH THIS IS VERY IMPORTANT!!!
                       If you are giving a SHORT or MEDIUM response, do not add a long response with [Answer] or an "Answer" heading. 
                       Always try to keep track of your response length especially before you give the response.""",
        },
        {"role": "user", "content": content},
    ]
    try:
        _logger.info({"message": "Using Chat Completion"})
        res = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
        reply = res["choices"][0]["message"]["content"]
    except:
        _logger.error({"message": "Error generating chat completion"})
        raise exceptions.InvalidChatCompletionException

    return chat_response(answer=reply, sources=pages)


@router.post(
    "/search",
    response_model=search_response,
    summary="Get chunks from Postgres DB with prompt string and result count",
    response_description="Sources that match the prompt (in a list)",
)
async def search_handler(request: Request, query: query):
    _logger.info({"message": "Calling Search Endpoint"})
    rows = await helper(request, query)
    response = []
    for row in rows:
        response.append(dict(row))

    return search_response(sources=response)


async def helper(request: Request, query: query):
    try:
        _logger.info({"message": "Creating embedding"})
        embedding = openai.Embedding.create(
            input=query.prompt, model="text-embedding-ada-002"
        )["data"][0]["embedding"]
        sql = "SELECT * FROM " + os.getenv("POSTGRES_SEARCH_FUNCTION") + "($1, $2, $3)"
    except:
        _logger.error({"message": "Issue with creating an embedding."})
        raise exceptions.InvalidPromptEmbeddingException
    
    try:
        _logger.info({"message": "Querying Postgres"})
        res = await request.app.state.db.fetch_rows(
            sql, np.array(embedding), query.similarity_threshold, query.results
        )
    except:
        _logger.error({"message": "Issue with querying Postgres."})
        raise exceptions.InvalidPostgresQueryException

    return res

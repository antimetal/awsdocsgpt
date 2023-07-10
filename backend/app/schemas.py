import os
from pydantic import BaseModel, HttpUrl
from dotenv import load_dotenv

load_dotenv()

class query(BaseModel):
    prompt: str
    temperature: float | None = 0.00
    similarity_threshold: float | None = 0.50
    sentences: str | None = "short"
    results: int | None = 5
    api_key: str | None = os.getenv("OPENAI_API_KEY")

class chunk(BaseModel):
    page_title: str
    page_url: HttpUrl
    content: str
    similarity: float

class message(BaseModel):
    role: str
    content: str

class search_response(BaseModel):
    sources: list[chunk]

class chat_response(search_response):
    messages: list[message]
from pydantic import BaseModel, HttpUrl

class query(BaseModel):
    prompt: str
    temperature: float | None = 0.00
    similarity_threshold: float | None = 0.00
    results: int | None = 1

class chunk(BaseModel):
    page_title: str
    page_url: HttpUrl
    content: str
    similarity: float

class search_response(BaseModel):
    sources: list[chunk]

class chat_response(search_response):
    answer: str
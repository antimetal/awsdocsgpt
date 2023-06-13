import os, openai
import asyncpg
from pgvector.asyncpg import register_vector
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router as api_router

load_dotenv()

app = FastAPI()

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_headers=["*"],
    allow_methods=["*"],
    allow_origins=["*"],
    allow_credentials=True,
)


async def connect_to_postgres():
    conn = await asyncpg.connect(
        host=os.getenv("POSTGRES_HOST"),
        database=os.getenv("POSTGRES_DB_NAME"),
        user=os.getenv("POSTGRES_USERNAME"),
        password=os.getenv("POSTGRES_PASSWORD"),
    )
    await register_vector(conn)
    return conn


@app.on_event("startup")
async def startup():
    openai.api_key = os.getenv("OPENAI_API_KEY")
    app.state.conn = await connect_to_postgres()


@app.on_event("shutdown")
async def shutdown():
    await app.state.conn.close()

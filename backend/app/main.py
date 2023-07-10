from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router as api_router
import app.database as db
import logging, yaml
from logging.config import dictConfig
from pathlib import Path

dictConfig(yaml.safe_load(Path("logging.yaml").read_text()))
_logger = logging.getLogger(__name__)

app = FastAPI()

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_headers=["*"],
    allow_methods=["*"],
    allow_origins=["*"],
    allow_credentials=True,
)

@app.on_event("startup")
async def startup():
    database_instance = db.Database()
    await database_instance.connect()
    app.state.db = database_instance
    _logger.info({"message": "FastAPI startup event"})


@app.on_event("shutdown")
async def shutdown():
    if app.state.db:
        await app.state.db.close()
    _logger.info({"message": "FastAPI shutdown event"})

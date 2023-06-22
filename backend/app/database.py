import asyncpg
import logging, os
from dotenv import load_dotenv
from pgvector.asyncpg import register_vector

_logger = logging.getLogger(__name__)

load_dotenv()

class Database:
    def __init__(self):
        _logger.info({"message": "Database info init"})
        self.user = os.getenv("POSTGRES_USERNAME")
        self.password = os.getenv("POSTGRES_PASSWORD")
        self.host = os.getenv("POSTGRES_HOST")
        self.port = "5432"
        self.database = os.getenv("POSTGRES_DB_NAME")
        self._cursor = None
        self._connection_pool = None
        
    async def connect(self):
        if not self._connection_pool:
            try:
                self._connection_pool = await asyncpg.create_pool(
                    min_size=1,
                    max_size=20,
                    command_timeout=60,
                    host=self.host,
                    port=self.port,
                    user=self.user,
                    password=self.password,
                    database=self.database,
                )
                _logger.info({"message": "Database pool connection opened"})

            except Exception as e:
                _logger.exception({"exception": e})

    async def fetch_rows(self, query: str, *args):
        if not self._connection_pool:
            await self.connect()
        else:
            con = await self._connection_pool.acquire()
            await register_vector(con)
            try:
                result = await con.fetch(query, *args)
                return result
            except Exception as e:
                _logger.exception({"exception": e})
            finally:
                await self._connection_pool.release(con)

    async def close(self):
        if not self._connection_pool:
            try:
                await self._connection_pool.close()
                _logger.info({"message": "Database pool connection closed"})
            except Exception as e:
                _logger.exception({"exception": e})
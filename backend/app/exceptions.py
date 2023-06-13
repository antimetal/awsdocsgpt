"""
API exceptions.
"""
from fastapi import HTTPException, status


class InvalidPromptEmbeddingException(HTTPException):
    """
    Issue generating an embedding for desired prompt.
    """

    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="There was an issue generating an embedding for your desired prompt.",
        )


class InvalidPostgresQueryException(HTTPException):
    """
    Postgres SQL Query was Invalid.
    """

    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to search or query the database.",
        )

class InvalidChatCompletionException(HTTPException):
    """
    Chat Completion was unable to successfully return a response.
    """

    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chat Completion was unable to successfully return a response.",
        )
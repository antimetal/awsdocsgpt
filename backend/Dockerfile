FROM python:3.11.1-slim

WORKDIR /awsgpt

COPY ./requirements.txt ./requirements.txt

RUN pip install --no-cache-dir --upgrade -r ./requirements.txt

COPY ./app ./app
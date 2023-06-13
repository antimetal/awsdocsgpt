# AWS Docs GPT

AI-powered search and chat for [AWS Documentation](https://docs.aws.amazon.com/).

## How It Works

AWS Docs GPT provides 2 things:

1. A search interface.
2. A chat interface.

### Search

Search was created with [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings) (`text-embedding-ada-002`).

First, we loop over the documentation urls and generate embeddings for each chunk of text in the page.

Then in the app we take the user's search query, generate an embedding, and use the result to find the pages that contain similar content 

The comparison is done using cosine similarity across our database of vectors.

Results are then ranked by similarity score and returned to the user.

### Chat

Chat builds on top of search. It uses search results to create a prompt that is fed into GPT-3.5-turbo.

This allows for a chat-like experience where the user can ask questions about AWS documentation and get answers.

## Running Locally

Here's a quick overview of how to run it locally.

### Requirements

1. Set up OpenAI

You'll need an OpenAI API key to generate embeddings (locally).

2. Set up a local image of PostgreSQL (I recommend the pgvector docker image)

There is a setup.sql file in the root of the repo that you can use to set up the database.

Run that in a SQL editor.

Note: Or, connect to any PostgreSQL server using the env variables defined below

### Repo Setup

3. Clone repo

```bash
git clone https://github.com/alexy201/awsdocsgpt.git
```

4. Install dependencies

```bash
cd frontend
npm i
cd ../backend
pip install -r requirements.txt
```

5. Set up environment variables

Create a .env.local file in the root of the frontend folder with the following variables:

```bash
NEXT_PUBLIC_SEARCH_ENDPOINT =
NEXT_PUBLIC_CHAT_ENDPOINT = 
```

Create a .env file in the root of the backend folder with the following variables:

```bash
OPENAI_API_KEY = 
POSTGRES_HOST = 
POSTGRES_DB_NAME = 
POSTGRES_USERNAME = 
POSTGRES_TABLE_NAME = #if you used setup.sql, this should be "aws_chunks"
POSTGRES_SEARCH_FUNCTION = #if you used setup.sql, this should be "aws_gpt_search"
POSTGRES_PASSWORD = 
```

### Dataset

6. Run parsing script

Note: The data-upload.py script requires the same environment variables as the backend folder. Add AWS documentation links to the additional.txt file (one url on each line). This will import chunks + embeddings from those urls to the PostgreSQL DB specified in .env.

```bash
python3 data/data-upload.py
```

Please be patient! Depending on the number of links inputted, this process will take anywhere from 30 minutes to multiple hours.

### App

7. Run entire app

```bash
cd backend
uvicorn app.main:app --reload
cd ../frontend
npm run dev
```

## Credits

Thanks to [Mckay Wrigley](https://github.com/mckaywrigley) for inspiring this project.

## Contact

If you have any questions, feel free to reach out to me on [Twitter](https://twitter.com/sima_alexx)!
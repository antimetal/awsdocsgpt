--  RUN 1st
create extension vector;

-- RUN 2nd
create table aws_chunks (
    page_title text,
    page_url text,
    content text,
    content_length bigint,
    content_tokens bigint,
    embedding vector (1536)
);

-- RUN 3rd after running the scripts
create or replace function aws_gpt_search (
    query_embedding vector (1536),
    similarity_threshold float,
    match_count int
)
returns table (
    page_title text,
    page_url text,
    content text,
    content_length bigint,
    content_tokens bigint,
    similarity float
)
language plpgsql
as $$
begin
    return query
    select
        aws_chunks.page_title,
        aws_chunks.page_url,
        aws_chunks.content,
        aws_chunks.content_length,
        aws_chunks.content_tokens,
        1 - (aws_chunks.embedding <=> query_embedding) as similarity
from aws_chunks
where 1 - (aws_chunks.embedding <=> query_embedding) > similarity_threshold
order by aws_chunks.embedding <=> query_embedding
limit match_count;
end;
$$;

-- RUN 4th
create index on aws_chunks
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);
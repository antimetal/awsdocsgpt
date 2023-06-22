export const SEARCH_ENDPOINT = process.env.NEXT_PUBLIC_SEARCH_ENDPOINT
export const CHAT_ENDPOINT = process.env.NEXT_PUBLIC_CHAT_ENDPOINT

interface Default {
    mode: string
    results: string
    sentences: string
    threshold: string
    [key: string]: string
}

export const defaults: Default = {
    "mode" : '2',
    "results" : '5',
    "sentences" : 'short',
    "threshold" : '0.5',
}
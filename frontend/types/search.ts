export interface SearchResult {
  page_title: string
  page_url: string
  content: string
}

export interface SearchResponse {
  sources: SearchResult[]
}

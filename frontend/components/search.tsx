"use client"

import * as React from "react"
import { extractFileTitles, formatStringWithMarkers } from "@/utils/format"
import ReactMarkdown from "react-markdown"

import { SearchResponse } from "@/types/search"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export interface SearchProps {
  isLoading: boolean
  data: SearchResponse | null
}

export function Search({ isLoading, data }: SearchProps) {
  const searchResults = data?.sources

  return (
    <React.Fragment>
      <Card className="ml-auto w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Documentation Sources:{" "}
          </CardTitle>
        </CardHeader>
        {isLoading && (
          <CardContent>
            <Skeleton className="max-w my-2 h-4" />
            <Skeleton className="max-w my-2 h-4" />
            <Skeleton className="max-w my-2 h-4" />
            <Skeleton className="max-w my-2 h-4" />
            <Skeleton className="my-2 h-4 max-w-[200px]" />
          </CardContent>
        )}
        {!isLoading && !searchResults?.length && (
          <CardContent
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="text-xl font-bold text-red-600">
              No Search Results Returned
            </div>
          </CardContent>
        )}
        {!isLoading &&
          searchResults?.map((source: any) => (
            <Card className="mx-2 md:mx-5 mb-5">
              <CardHeader>
                <CardTitle className="mb-2" link={source["page_url"]}>
                  {extractFileTitles(source["page_title"])}
                </CardTitle>
                <CardDescription>
                  <hr className="border-t-4" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="my-4 text-xl font-bold text-antimetal"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="mb-1 mt-3 text-lg font-bold" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="m-4 p-2" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="m-4 p-2" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li style={{ listStyleType: "decimal" }} {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-md my-2 [overflow-wrap:anywhere]" {...props} />
                    ),
                    pre: ({ node, ...props }) => (
                      <span
                        className="m-5 inline-block break-all p-3 whitespace-pre-wrap"
                        {...props}
                      />
                    ),
                    code: ({ node, ...props }) => (
                      <code className="inline-block break-all p-3" {...props} />
                    ),
                  }}
                >
                  {formatStringWithMarkers(source["content"])}
                </ReactMarkdown>
              </CardContent>
            </Card>
          ))}
      </Card>
    </React.Fragment>
  )
}

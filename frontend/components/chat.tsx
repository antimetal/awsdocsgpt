"use client"

import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import ReactMarkdown from 'react-markdown'

export function Chat({ isLoading, data }: { isLoading: boolean; data: any }) {
  return (
    <React.Fragment>
      <Card className="max-w w-full mr-6">
        <CardHeader>
          <CardTitle className="font-bold text-xl">
            {" "}
            Chat Response:{" "}
          </CardTitle>
        </CardHeader>
        {isLoading && (
          <CardContent>
            <Skeleton className="h-4 max-w my-2" />
            <Skeleton className="h-4 max-w my-2" />
            <Skeleton className="h-4 max-w my-2" />
            <Skeleton className="h-4 max-w my-2" />
            <Skeleton className="h-4 max-w-[300px] my-2" />
          </CardContent>
        )}
        {!isLoading && data != null && (
          <CardContent className="font-medium">
            <ReactMarkdown components={{
              h1: ({ node, ...props }) => ( <h1 className="text-xl text-orange-500 font-bold my-4" {...props} /> ),
              h2: ({ node, ...props }) => ( <h2 className="text-lg font-bold mb-1 mt-3" {...props} /> ),
              ol: ({ node, ...props }) => ( <ol style={{ listStyleType: 'decimal' }} className="m-4 p-2" {...props} /> ),
              ul: ({ node, ...props }) => ( <ul style={{ listStyleType: 'disc' }} className="m-4 p-2" {...props} /> ),
              p: ({ node, ...props }) => ( <p className="text-md my-2" {...props} /> ),
              pre: ({ node, ...props }) => ( <span className="m-4 inline-block break-all" {...props} /> ),
              code: ({ node, ...props }) => ( <code className="p-1 inline-block break-all" {...props} /> ),
            }}>
              {data.answer}
            </ReactMarkdown>
          </CardContent>
        )}
      </Card>
    </React.Fragment>
  )
}

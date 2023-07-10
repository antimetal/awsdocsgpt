"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { UseChatHelpers } from 'ai/react'

export interface ChatProps {
  isLoading: boolean
  messages: UseChatHelpers['messages']
}

export function Chat({ isLoading, messages }: ChatProps) {
  const messageCheck = (messages : any) => {
    if (messages == null || messages.length <= 2) {
      return null
    }
    const chat_result = messages[messages.length - 1]
    if (chat_result != null) {
      return chat_result.content
    } else {
      return null
    }
  }

  return (
    <React.Fragment>
      <Card className="max-w mr-6 w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold"> Chat Response: </CardTitle>
        </CardHeader>
        {isLoading && (
          <CardContent>
            <Skeleton className="max-w my-2 h-4" />
            <Skeleton className="max-w my-2 h-4" />
            <Skeleton className="max-w my-2 h-4" />
            <Skeleton className="max-w my-2 h-4" />
            <Skeleton className="my-2 h-4 max-w-[300px]" />
          </CardContent>
        )}
        {!isLoading && messages != null && (
          <CardContent className="font-medium">
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
                  <ol
                    style={{ listStyleType: "decimal" }}
                    className="m-4 p-2"
                    {...props}
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul
                    style={{ listStyleType: "disc" }}
                    className="m-4 p-2"
                    {...props}
                  />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-md my-2" {...props} />
                ),
                pre: ({ node, ...props }) => (
                  <span className="m-4 inline-block break-all whitespace-pre-wrap" {...props} />
                ),
                code: ({ node, ...props }) => (
                  <code className="inline-block break-all p-1" {...props} />
                ),
              }}
            >
              {messageCheck(messages)}
            </ReactMarkdown>
          </CardContent>
        )}
      </Card>
    </React.Fragment>
  )
}

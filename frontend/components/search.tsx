"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import ReactMarkdown from 'react-markdown'

function formatStringWithMarkers(text: string) {
    const txt = text.replace(/@@@/g, "")
    const formattedText = txt
      .replace(
        /\^\^\^([^]+?)\^\^\^/g,
        '\n # $1 \n'
      )
      .replace(
        /\^\^([^]+?)\^\^/g,
        '\n ## $1 \n'
      )
      .replace(
        /\^([^]+?)\^/g,
        '\n ### $1 \n'
      )
      .replace(
        /~~([^]+?)~~/g,
        '```$1```'
      )
    return formattedText
}

function extractFileTitles(filePath: string) {
    const fileTitles = filePath.split("\\").filter(Boolean)
    if (fileTitles.length < 3) {
        return filePath
    } else {
        const lastIndex = fileTitles.length - 1
        const firstIndex = 1
        const secondIndex = 2
        const lastTitle = fileTitles[lastIndex] || ""
        const firstTitle = fileTitles[firstIndex] || ""
        const secondTitle = fileTitles[secondIndex] || ""
        if (firstTitle == "none") {
        return secondTitle + '\\' + lastTitle
        }
        return firstTitle + "\\" + secondTitle + "\\" + lastTitle
    }
}

export function Search({ isLoading, data }: { isLoading: boolean; data: any }) {
  const arr = data != null ? data.sources : null

  return (
    <React.Fragment>
      <Card className="w-full ml-auto">
        <CardHeader>
          <CardTitle className="font-bold text-xl">
            Documentation Sources:{" "}
          </CardTitle>
        </CardHeader>
        {isLoading && (
          <CardContent>
            <Skeleton className="h-4 max-w my-2" />
            <Skeleton className="h-4 max-w my-2" />
            <Skeleton className="h-4 max-w my-2" />
            <Skeleton className="h-4 max-w my-2" />
            <Skeleton className="h-4 max-w-[200px] my-2" />
          </CardContent>
        )}
        {!isLoading && (arr == null || arr.length == 0) && (
            <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div className="text-xl font-bold text-red-600">No Search Results Returned</div>
            </CardContent>
        )}
        {!isLoading &&
          arr != null &&
          arr.map((source: any) => (
            <Card className="mx-5 mb-5">
              <CardHeader>
                <CardTitle className="mb-2" link={source["page_url"]}>
                  {extractFileTitles(source["page_title"])}
                </CardTitle>
                <CardDescription>
                  <hr className="border-t-4" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReactMarkdown components={{
                    h1: ({ node, ...props }) => ( <h1 className="text-xl text-orange-500 font-bold my-4" {...props} /> ),
                    h2: ({ node, ...props }) => ( <h2 className="text-lg font-bold mb-1 mt-3" {...props} /> ),
                    ol: ({ node, ...props }) => ( <ol className="m-4 p-2" {...props} /> ),
                    ul: ({ node, ...props }) => ( <ul className="m-4 p-2" {...props} /> ),
                    li: ({ node, ...props }) => ( <li style={{ listStyleType: 'decimal' }} {...props} /> ),
                    p: ({ node, ...props }) => ( <p className="text-md" {...props} /> ),
                    pre: ({ node, ...props }) => ( <pre className="m-5 p-3 inline-block break-all" {...props} /> ),
                    code: ({ node, ...props }) => ( <code className="p-3 inline-block break-all" {...props} /> ),
                }}>
                    {formatStringWithMarkers(source['content'])}
                </ReactMarkdown>
              </CardContent>
            </Card>
          ))}
      </Card>
    </React.Fragment>
  )
}

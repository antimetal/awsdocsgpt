"use client"

import * as React from "react"
import { useState, useRef } from 'react';

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function Search({isLoading, data} : {isLoading : boolean, data: any}) {
    const arr = (data != null) ? data.sources : null;

    function formatStringWithMarkers(text: string) {
        const txt = text.replace(/@@@/g, "")
        const formattedText = txt
            .replace(/\^\^\^([^]+?)\^\^\^/g, '<\p><h1 style="font-weight: bold; color: #ed8936; margin-bottom: 0.7rem;" >$1</h1><p>')
            .replace(/\^\^([^]+?)\^\^/g, '<\p><h2 style="font-weight: bold; color: black; margin-bottom: 0.5rem;">$1</h2><p>')
            .replace(/\^([^]+?)\^/g, '<\p><h3 style="font-weight: bold; color: gray; margin-bottom: 0.3rem;">$1</h3><p>')
            .replace(/~~([^]+?)~~/g, '<\p><div style="color: gray; margin: 0.7rem; padding: 0.5rem; display: inline-block"><code style="word-break: break-all">$1</code></div><p>');
        console.log('<p>' + formattedText + '<\p>')
        return '<p>' + formattedText + '<\p>';
    }

    function extractFileTitles(filePath: string) {
        const fileTitles = filePath.split('\\').filter(Boolean);
        if (fileTitles.length < 3){
            return filePath;
        }else {
            const lastIndex = fileTitles.length - 1;
            const firstIndex = 1;
            const secondIndex = 2;
            const lastTitle = fileTitles[lastIndex] || '';
            const firstTitle = fileTitles[firstIndex] || '';
            const secondTitle = fileTitles[secondIndex] || '';
            return firstTitle + '\\' + secondTitle + '\\' + lastTitle;
        }
      }

    return (
        <React.Fragment>
            <Card className="w-full ml-auto">
                <CardHeader>
                    <CardTitle  className="font-bold text-xl">Documentation Sources: </CardTitle>
                </CardHeader>
                {isLoading &&
                    <CardContent>
                        <Skeleton className="h-4 max-w my-2" />
                        <Skeleton className="h-4 max-w my-2" />
                        <Skeleton className="h-4 max-w my-2" />
                        <Skeleton className="h-4 max-w my-2" />
                        <Skeleton className="h-4 max-w-[200px] my-2" />
                    </CardContent>
                }
                {!isLoading && arr != null &&
                    arr.map((source: any) => (
                        <Card className="mx-5 mb-5">
                            <CardHeader>
                                <CardTitle className="mb-2" link={source['page_url']}>{extractFileTitles(source['page_title'])}</CardTitle>
                                <CardDescription><hr className="border-t-4"/></CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div dangerouslySetInnerHTML={{ __html: formatStringWithMarkers(source['content']) }} />
                            </CardContent>
                        </Card>
                    ))
                }
            </Card>
        </React.Fragment>
    )
  }
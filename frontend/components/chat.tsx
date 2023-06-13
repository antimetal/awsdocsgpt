"use client"

import * as React from "react"

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

export function Chat({isLoading, data} : {isLoading : boolean, data: any}) {
    return (
        <React.Fragment>
            <Card className="max-w w-full mr-6 mt-8">
                <CardHeader>
                    <CardTitle className="font-bold text-xl"> Chat Response: </CardTitle>
                </CardHeader>
                {isLoading &&
                    <CardContent>
                        <Skeleton className="h-4 max-w my-2" />
                        <Skeleton className="h-4 max-w my-2" />
                        <Skeleton className="h-4 max-w my-2" />
                        <Skeleton className="h-4 max-w my-2" />
                        <Skeleton className="h-4 max-w-[300px] my-2" />
                    </CardContent>
                }
                {!isLoading && data != null &&
                    <CardContent>
                        <Label className="text-gray-500">{data.answer}</Label>
                    </CardContent>
                }
            </Card>
        </React.Fragment>
    )
  }
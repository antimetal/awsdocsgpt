"use client"

import { useRef, useState } from "react"

import { siteConfig } from "@/config/site"
import { OutputComponent } from "@/components/cases"
import { Prompt } from "@/components/prompt"

export default function IndexPage() {
  const [chat, setChat] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [data, setData] = useState(null)

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl leading-tight tracking-tight md:text-3xl font-mono">
          AI-powered <span className="font-extrabold">Search</span> &{" "}
          <span className="font-extrabold">Chat</span> for{" "}
          <span className="font-extrabold text-orange-500">
            <a href={siteConfig.links.documentation}>AWS Documentation</a>
          </span>{" "}
          <br className="hidden sm:inline" />
        </h1>
      </div>
      <Prompt onChange={setChat} setLoading={setLoading} setData={setData} />
      <OutputComponent chat={chat} isLoading={isLoading} data={data} />
    </section>
  )
}

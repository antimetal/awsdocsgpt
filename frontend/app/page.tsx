"use client"

import Link from "next/link"

import { useState, useRef } from 'react';
import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Settings } from "@/components/settings"
import { Prompt } from "@/components/prompt"
import { Chat } from "@/components/chat"
import { Search } from "@/components/search"

export default function IndexPage() {
  const check_mode = typeof window !== 'undefined' ? localStorage.getItem('mode') : null;
  const check_results = typeof window !== 'undefined' ? localStorage.getItem('results') : null;
  const [mode, setMode] = useState(check_mode || '1');
  const [results, setResults] = useState(check_results || '1');
  const [chat, setChat] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          AI-powered search & chat for <span className="text-orange-500">AWS Documentation</span> <br className="hidden sm:inline" />
        </h1>
      </div>
      <div className="flex gap-4">
        <Settings></Settings>
        {/* <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline" })}
        >
          GitHub
        </Link> */}
      </div>
      <Prompt onChange={setChat} setLoading={setLoading} setData={setData}/>
      {(chat == 2) && <Chat isLoading={isLoading} data={data}/>}
      {(chat == 1 || chat == 2) && <Search isLoading={isLoading} data={data}/>}
    </section>
  )
}

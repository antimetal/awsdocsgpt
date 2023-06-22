"use client"

import * as React from "react"
import { ChangeEvent, useState } from "react"
import Link from "next/link"
import { Icons } from "@/icons/icons"
import { fetchData } from "lib/api"

import { Button } from "@/components/ui/button"
import { Input, TextInput } from "@/components/ui/input"
import { defaults } from "@/config/config";

export function Prompt({
  onChange,
  setLoading,
  setData,
}: {
  onChange: (value: React.SetStateAction<number>) => void
  setLoading: (value: boolean) => void
  setData: (value: any) => void
}) {
  const [textareaValue, setTextareaValue] = useState("")
  const [disabled, setDisable] = useState(false)
  const [noSubmit, setNoSubmit] = useState(true)

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length > 0) {
      setNoSubmit(false)
    } else {
      setNoSubmit(true)
    }
    setTextareaValue(event.target.value)
  }

  const clearPrompt = () => {
    setNoSubmit(true)
    setTextareaValue("")
  }

  const listener = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      callAPI()
    }
  }

  const callAPI = async () => {
    if (!noSubmit) {
      try {
        setDisable(true)
        setLoading(true)
        const check_mode =
          typeof window !== "undefined" ? localStorage.getItem("mode") : null
        const check_results =
          typeof window !== "undefined" ? localStorage.getItem("results") : null
        const check_sentences = 
          typeof window !== 'undefined' ? localStorage.getItem('sentences') : null
        const check_threshold = 
          typeof window !== 'undefined' ? localStorage.getItem('threshold') : null
        onChange(Number(check_mode || defaults['mode']))
        const data = await fetchData(
          textareaValue,
          check_mode || defaults['mode'],
          check_results || defaults['results'], 
          check_sentences || defaults['sentences'],
          check_threshold || defaults['threshold']
        )
        setData(data)
        setLoading(false)
        setDisable(false)
      } catch (err) {
        setDisable(false)
        setLoading(false)
        console.log(err)
      }
    }
  }

  return (
    <React.Fragment>
      <div className="flex items-end mt-2 gap-4 w-full relative">
        <Icons.search className="absolute left-4 top-10 transform -translate-y-1/2 h-8 w-8" />
        <TextInput
          className="pr-20 resize-none overflow-hidden pt-6 pb-2"
          placeholder="What is a VPC?"
          id="prompt"
          disabled={disabled}
          value={textareaValue}
          onChange={handleTextareaChange}
          onKeyDown={(e) => listener(e)}
          rows={1}
        />
        <Button
          disabled={noSubmit}
          className="absolute right-3 top-10 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 rounded-lg h-14 w-14"
          onClick={callAPI}
        >
          <Icons.in />
        </Button>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Link
          href=""
          className="text-orange-500 -translate-y-1/3 font-semibold pr-4"
          onClick={clearPrompt}
        >
          Clear Prompt
        </Link>
      </div>
    </React.Fragment>
  )
}

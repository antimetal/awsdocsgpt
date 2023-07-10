import * as React from "react"

import { Chat } from "@/components/chat"
import { Search } from "@/components/search"
import { UseChatHelpers } from 'ai/react'

export enum Case {
  SEARCH = 1,
  CHAT = 2,
}

interface OutputComponentProps {
  chat: number
  isLoading: boolean
  data: any
  messages: UseChatHelpers['messages']
  apiKeyListener: boolean
}

export function OutputComponent({
  chat,
  isLoading,
  data,
  messages,
  apiKeyListener,
}: OutputComponentProps) {
  if (!apiKeyListener) {
    switch (chat) {
      case Case.SEARCH:
        return <Search isLoading={isLoading} data={data} />
      case Case.CHAT:
        return (
          <React.Fragment>
            <Chat isLoading={isLoading} messages={messages} />
            <Search isLoading={isLoading} data={data} />
          </React.Fragment>
        )
      default:
        return null
    }
  }else {
    return (
      <div className="text-center flex justify-center text-xl font-bold text-red-600">
        Please Input a Valid API Key
      </div>
    )
  }
}

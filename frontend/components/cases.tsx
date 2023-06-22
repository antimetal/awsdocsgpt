import * as React from "react"

import { Chat } from "@/components/chat"
import { Search } from "@/components/search"

export enum cases {
  SEARCH = 1,
  CHAT = 2,
}

export function OutputComponent({
  chat,
  isLoading,
  data,
}: {
  chat: number
  isLoading: boolean
  data: any
}) {
  if (chat == cases.CHAT) {
    return (
      <React.Fragment>
        <Chat isLoading={isLoading} data={data} />
        <Search isLoading={isLoading} data={data} />
      </React.Fragment>
    )
  } else if (chat == cases.SEARCH) {
    return <Search isLoading={isLoading} data={data} />
  }

  // Handle other cases if needed
  return null
}

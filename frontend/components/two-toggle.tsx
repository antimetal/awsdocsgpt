"use client"

import * as React from "react"
import { Bold } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Toggle } from "@/components/ui/toggle"

export function TwoToggle({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const handleToggleChange = (toggleNumber: number) => {
    onChange(String(toggleNumber))
  }

  return (
    <React.Fragment>
      <Toggle
        variant="outline"
        aria-label="Toggle italic"
        pressed={value == "1"}
        onPressedChange={() => handleToggleChange(1)}
      >
        <Label weight="light">Search</Label>
      </Toggle>
      <Toggle
        variant="outline"
        aria-label="Toggle italic"
        pressed={value == "2"}
        onPressedChange={() => handleToggleChange(2)}
      >
        <Label weight="light">Chat</Label>
      </Toggle>
    </React.Fragment>
  )
}

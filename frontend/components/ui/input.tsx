"use client"

import * as React from "react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  max?: number
  min?: number
  item: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, min, max, item, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
        max={max}
        min={min}
        defaultValue={props.defaultValue}
      />
    )
  }
)
Input.displayName = "Input"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  mobile: boolean
}

const TextInput = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, mobile, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
      const textarea = textareaRef.current!

      const adjustTextareaHeight = () => {
        textarea.style.height = "auto"
        if (mobile){
          textarea.style.height = `${textarea.scrollHeight + 3}px`
        }else {
          textarea.style.height = `${Math.max(textarea.scrollHeight + 10, 80)}px`
        }
      }

      textarea.addEventListener("input", adjustTextareaHeight)

      return () => {
        textarea.removeEventListener("input", adjustTextareaHeight)
      }
    }, [])

    return (
      <textarea
        className={cn(
          "flex h-18 md:h-20 w-full rounded-lg border border-input bg-transparent px-14 md:px-16 py-2 text-md md:text-xl ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={textareaRef}
        {...props}
      />
    )
  }
)
TextInput.displayName = "TextInput"

export interface KeyInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
}

const KeyInput = React.forwardRef<HTMLInputElement, KeyInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
KeyInput.displayName = "KeyInput"

export { Input, TextInput, KeyInput }

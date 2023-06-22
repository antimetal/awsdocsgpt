"use client"

import * as React from "react"
import { useRef, useEffect } from 'react';
import { cn } from "@/lib/utils"
import { defaults } from "@/config/config";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  max?: number
  min?: number
  item: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, min, max, item, ...props }, ref) => {

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(event.target.value)
      if (max !== undefined) {
        if (newValue > max) {
          event.target.value = String(max)
        }
      }
      if (min !== undefined) {
        if (newValue < min) {
          event.target.value = String(min)
        }
      }
      if (isNaN(Number(newValue))) {
        event.target.value = String(min)
      }
    }

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
        defaultValue = {localStorage.getItem(item) || defaults[item]}
        onBlur={handleInputChange}
      />
    )
  }
)
Input.displayName = "Input"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextInput = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      const textarea = textareaRef.current!;

      const adjustTextareaHeight = () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.max(textarea.scrollHeight + 10, 80)}px`;
      };

      textarea.addEventListener('input', adjustTextareaHeight);

      return () => {
        textarea.removeEventListener('input', adjustTextareaHeight);
      };
    }, []);

    return (
      <textarea
        className={cn(
          "flex h-20 w-full rounded-lg border border-input bg-transparent px-16 py-2 text-xl ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={textareaRef}
        {...props}
      />
    )
  }
)
TextInput.displayName = "TextInput"

export { Input, TextInput }

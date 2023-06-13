'use client'

import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    max?: number;
    min?: number;
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, min, max, ...props }, ref) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(event.target.value);
      if (max !== undefined) {
        if (newValue > max) {
          event.target.value = String(max);
        }
      }
      if (min !== undefined) {
        if (newValue < min) {
          event.target.value = String(min);
        }
      }
      if (isNaN(Number(newValue))) {
        event.target.value = String(min);
      }
    };

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
        defaultValue = {localStorage.getItem('results') || '5'}
        onBlur={handleInputChange}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

import * as React from "react"
import { siteConfig } from "@/config/site"
import { Icons } from "@/icons/icons"

export function AntimetalComponent() {
    return (
        <div className="flex items-center justify-start mt-2">
          <a href={siteConfig.links.antimetal} target="_blank" rel="noopener noreferrer" className="ml-2 mt-5">
            <Icons.antimetal />
          </a>
          <h2 className="ml-5 font-mono md:text-xl text-md leading-tight tracking-tight mt-7">
            Use {" "}
            <span className="font-extrabold">
              <a href={siteConfig.links.antimetal} target="_blank" rel="noopener noreferrer">
                Antimetal
              </a>
            </span>{" "} to save up to {" "}
            <span className="font-extrabold">
              75% on your AWS bill
            </span>{" "} using AI
          </h2>
          <br className="hidden sm:inline" />
        </div>
    )
}
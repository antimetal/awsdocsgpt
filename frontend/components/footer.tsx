"use client"

import Link from "next/link"
import { Icons } from "@/icons/icons"
import { useWindowSize } from "usehooks-ts"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export function Footer() {
  const { width } = useWindowSize()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        {width >= 800 && (
          <Label className="flex h-full w-full items-center justify-center text-lg text-gray-500">
            Created by&nbsp;<a href={siteConfig.links.personal}>Alex Sima</a>{/*, sponsored by&nbsp;
            <a href={siteConfig.links.antimetal}>
              <Image src="/antimetal.png" height={40} width={100} alt="Antimetal logo" />
              Antimetal
            </a>*/}
          </Label>
        )}
        <div className="absolute flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.twitter className="h-5 w-5 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

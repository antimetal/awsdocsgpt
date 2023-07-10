import {
  ArrowRight,
  Cog,
  LucideProps,
  Moon,
  Search,
  Settings,
  SunMedium,
  Twitter,
  type Icon as LucideIcon,
} from "lucide-react"

import ExternalLink from "./external-link"
import Github from "./github"
import Logo from "./logo"
import Antimetal from "./antimetal"

export type Icon = LucideIcon

export const Icons = {
  sun: SunMedium,
  settings: Settings,
  moon: Moon,
  twitter: Twitter,
  search: Search,
  in: ArrowRight,
  logo: Logo,
  cog: Cog,
  github: Github,
  external: ExternalLink,
  antimetal: Antimetal,
}

import { MainNav } from "@/components/main-nav"
import { Settings } from "@/components/settings"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Settings></Settings>
          </nav>
        </div>
      </div>
    </header>
  )
}

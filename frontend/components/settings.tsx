"use client"

import { useState } from "react"
import { Icons } from "@/icons/icons"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input, KeyInput } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ComboBox } from "@/components/combobox"
import { TwoToggle } from "@/components/two-toggle"
import { getSettings, updateSettings } from "@/lib/settings"
import { Settings } from "@/types/settings"
import { DEFAULT_LIMITS } from "@/config/config"

export function Settings() {
  const cachedSettings = getSettings();
  const [settings, setSettings] = useState<Settings>(cachedSettings);

  const edgeResults = (key: string, value: string) => {
    const newValue = Number(value)
    if (newValue > DEFAULT_LIMITS.results_max) {
      setSettings(previousSettings => ({ ...previousSettings, [key]: String(DEFAULT_LIMITS.results_max) }))
    }else if (newValue < DEFAULT_LIMITS.results_min) {
      setSettings(previousSettings => ({ ...previousSettings, [key]: String(DEFAULT_LIMITS.results_min) }))
    }else if (isNaN(Number(newValue))) {
      setSettings(previousSettings => ({ ...previousSettings, [key]: String(DEFAULT_LIMITS.results_min) }))
    }else {
      setSettings(previousSettings => ({ ...previousSettings, [key]: value }))
    }
  }

  const handleUpdate = (key: string, value: string) => {
    if (key == "results") {
      edgeResults(key, value)
    }else {
      setSettings(previousSettings => ({ ...previousSettings, [key]: value }))
    }
  }

  const handleSliderChange = (value: number[]) => {
    handleUpdate("threshold", `${value}`)
  }

  const handleSaveChanges = () => {
    updateSettings(settings)
  }

  return (
    <Dialog>
      <DialogTrigger>
        <>
          <div
            className={buttonVariants({
              size: "sm",
              variant: "ghost",
            })}
          >
            <Icons.cog className="h-5 w-5" />
          </div>
        </>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customize your app settings.</DialogTitle>
          <DialogDescription>
            Choose your GPT mode, API Key, search result count, and chat response length. Use the similarity scale to measure the{` `}
            closeness between your prompt and the search results—a higher value indicates stronger match.
            <br />
            <br />
            Click “Save Changes” to confirm your settings.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mode" className="text-right">
              Mode
            </Label>
            <TwoToggle value={settings.mode} onChange={(value) => handleUpdate("mode", value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api_key" className="text-right">
              OpenAI Key
            </Label>
            <KeyInput
              id="api_key"
              className="col-span-3"
              defaultValue={settings.api_key}
              placeholder="ex. sk-123456789"
              onChange={(e) => handleUpdate("api_key", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="results" className="text-right">
              Results
            </Label>
            <Input
              id="results"
              className="col-span-3"
              min={DEFAULT_LIMITS.results_min}
              max={DEFAULT_LIMITS.results_max}
              defaultValue={settings.results}
              item="results"
              onChange={(e) => handleUpdate("results", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sentences" className="text-right">
              Response
            </Label>
            <ComboBox value={settings.sentences} onChange={(value) => handleUpdate("sentences", value)} />
          </div>
          <div className="my-2 grid grid-cols-12">
            <Label htmlFor="threshold" className="col-span-3 text-center">
              Similarity
            </Label>
            <Label className="col-span-2 text-center">0.0</Label>
            <Slider
              value={[parseFloat(settings.threshold)]}
              onValueChange={handleSliderChange}
              max={0.9}
              step={0.05}
              className="col-span-5"
            />
            <Label className="col-span-2 text-center">0.9</Label>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveChanges}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

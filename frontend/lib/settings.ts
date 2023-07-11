import _ from "lodash"

import { Settings } from "@/types/settings"
import { DEFAULT_SETTINGS } from "@/config/config"

import storage from "./storage"

export const getSettings = (): Settings => {
  try {
    const settings = storage.getItem("settings") ?? "{}"

    const parsedSettings = JSON.parse(settings)

    return _.merge(DEFAULT_SETTINGS, parsedSettings)
  } catch (err) {
    return DEFAULT_SETTINGS
  }
}

export const updateSettings = (settings: Partial<Settings>): Settings => {
  try {
    const currentSettings = getSettings()
    const newSettings = _.merge(currentSettings, settings)

    storage.setItem("settings", JSON.stringify(newSettings))

    return newSettings
  } catch (err) {
    return DEFAULT_SETTINGS
  }
}

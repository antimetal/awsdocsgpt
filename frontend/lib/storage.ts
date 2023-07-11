export const STORAGE_PREFIX = "awsdocsgpt"

const storage = {
  getItem(key: string) {
    return localStorage.getItem(`${STORAGE_PREFIX}-${key}`)
  },
  setItem(key: string, value: string) {
    return localStorage.setItem(`${STORAGE_PREFIX}-${key}`, value)
  },
}

export default storage

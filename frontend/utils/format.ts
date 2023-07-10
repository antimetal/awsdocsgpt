export function formatStringWithMarkers(text: string) {
  const txt = text.replace(/@@@/g, "")

  const formattedText = txt
    .replace(/\^\^\^([^]+?)\^\^\^/g, "\n # $1 \n")
    .replace(/\^\^([^]+?)\^\^/g, "\n ## $1 \n")
    .replace(/\^([^]+?)\^/g, "\n ### $1 \n")
    .replace(/~~([^]+?)~~/g, "```$1```")

  return formattedText
}

export function extractFileTitles(filePath: string) {
  const fileTitles = filePath.split("\\").filter(Boolean)

  if (fileTitles.length < 3) {
    return filePath
  }

  const lastIndex = fileTitles.length - 1
  const firstIndex = 1
  const secondIndex = 2
  const lastTitle = fileTitles[lastIndex] || ""
  const firstTitle = fileTitles[firstIndex] || ""
  const secondTitle = fileTitles[secondIndex] || ""
  if (firstTitle == "none") {
    return secondTitle + "\\" + lastTitle
  }

  return firstTitle + "\\" + secondTitle + "\\" + lastTitle
}

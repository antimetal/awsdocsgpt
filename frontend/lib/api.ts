import axios from "axios"
import { CHAT_ENDPOINT, SEARCH_ENDPOINT } from "config/config"

function createRequest(
  textareaValue: string,
  results: string,
  sentences: string,
  threshold: string,
  api_key: string
) {
  return api_key === "" ? {
    prompt: textareaValue,
    results: results,
    sentences: sentences,
    similarity_threshold: threshold,
    temperature: "0.5",
  } : {
    prompt: textareaValue,
    results: results,
    sentences: sentences,
    similarity_threshold: threshold,
    temperature: "0.5",
    api_key: api_key,
  }
}

export async function fetchData(
  textareaValue: string,
  mode: string,
  results: string,
  sentences: string,
  threshold: string,
  api_key: string
) {
  try {
    const url = mode === "1" ? SEARCH_ENDPOINT : CHAT_ENDPOINT

    const response = await axios.post(
      url || "",
      createRequest(textareaValue, results, sentences, threshold, api_key),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    return response.data
  } catch (err) {
    console.log(err)
    throw err
  }
}

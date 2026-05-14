/**
 * Safely extract an error message from a fetch Response.
 * Handles cases where the response isn't JSON (e.g., Vercel 413 HTML pages,
 * network errors, or gateway timeouts).
 */
export async function getResponseError(res: Response, fallback: string): Promise<string> {
  try {
    const text = await res.text()
    const json = JSON.parse(text)
    return json.error ?? fallback
  } catch {
    if (res.status === 413) return 'The file is too large. Please reduce the size and try again.'
    if (res.status === 502 || res.status === 504) return 'The server is temporarily unavailable. Please try again in a moment.'
    return `${fallback} (status ${res.status})`
  }
}

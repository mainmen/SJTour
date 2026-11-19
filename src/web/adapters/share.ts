import { detectMapsProvider, type MapsProvider } from '@/core/services/directions'

export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'failed'

/**
 * Shares a link with the system share sheet where there is one (phones), or
 * copies it to the clipboard. Never throws.
 */
export async function shareLink(data: { title: string; url: string }): Promise<ShareOutcome> {
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share(data)
      return 'shared'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled'
      // Fall through to the clipboard (e.g. a share sheet refused the data).
    }
  }
  try {
    await navigator.clipboard.writeText(data.url)
    return 'copied'
  } catch {
    return 'failed'
  }
}

/** The maps app for this device's "Directions" hand-off. */
export function browserMapsProvider(): MapsProvider {
  return detectMapsProvider(navigator.userAgent)
}

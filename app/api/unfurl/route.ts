import type { NextRequest } from 'next/server'
import { safeFetchText } from '@/lib/server/safe-fetch'
import { parsePreview, type LinkPreview } from '@/lib/server/unfurl'

const MAX_HTML_BYTES = 512 * 1024
const CACHE_TTL = 60 * 60 * 1000
const CACHE_LIMIT = 500

// Small in-memory cache so the same link isn't fetched for every viewer
const cache = new Map<string, { at: number; data: LinkPreview | null }>()

const remember = (key: string, data: LinkPreview | null) => {
  if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value!)
  cache.set(key, { at: Date.now(), data })
}

/** GET /api/unfurl?url=https://… → Open Graph preview for a link */
export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get('url')
  if (!target || target.length > 2048) return Response.json({ error: 'Missing url' }, { status: 400 })

  let normalized: string
  try {
    normalized = new URL(target).href
  } catch {
    return Response.json({ error: 'Invalid url' }, { status: 400 })
  }

  const hit = cache.get(normalized)
  if (hit && Date.now() - hit.at < CACHE_TTL) {
    return hit.data
      ? Response.json(hit.data, { headers: { 'Cache-Control': 'public, max-age=3600' } })
      : Response.json({ error: 'No preview' }, { status: 404 })
  }

  try {
    const { url, contentType, text } = await safeFetchText(normalized, MAX_HTML_BYTES)
    if (!contentType.includes('html')) {
      remember(normalized, null)
      return Response.json({ error: 'Not an HTML page' }, { status: 404 })
    }
    const preview = parsePreview(text, url)
    const useful = preview.title || preview.description || preview.image ? preview : null
    remember(normalized, useful)
    return useful
      ? Response.json(useful, { headers: { 'Cache-Control': 'public, max-age=3600' } })
      : Response.json({ error: 'No preview' }, { status: 404 })
  } catch {
    // Unreachable, blocked (private address) or malformed: just no preview
    remember(normalized, null)
    return Response.json({ error: 'Could not load preview' }, { status: 422 })
  }
}

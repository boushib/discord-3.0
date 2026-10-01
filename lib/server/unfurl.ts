export interface LinkPreview {
  url: string
  siteName?: string
  title?: string
  description?: string
  image?: string
  themeColor?: string
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

const decode = (s: string) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n: string) => ENTITIES[n.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ')
    .trim()

const ATTR = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g

/** Pull Open Graph / Twitter / standard meta tags out of an HTML document */
export const parsePreview = (html: string, pageUrl: URL): LinkPreview => {
  const meta: Record<string, string> = {}
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs: Record<string, string> = {}
    for (const m of tag.matchAll(ATTR)) attrs[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? ''
    const key = (attrs.property || attrs.name || '').toLowerCase()
    if (key && attrs.content && !(key in meta)) meta[key] = decode(attrs.content)
  }
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]

  const absolute = (value?: string) => {
    if (!value) return undefined
    try {
      const resolved = new URL(value, pageUrl)
      return resolved.protocol === 'https:' || resolved.protocol === 'http:' ? resolved.href : undefined
    } catch {
      return undefined
    }
  }
  const clip = (s: string | undefined, n: number) => (s && s.length > n ? `${s.slice(0, n - 1)}…` : s)

  return {
    url: pageUrl.href,
    siteName: clip(meta['og:site_name'] || meta['application-name'] || pageUrl.hostname.replace(/^www\./, ''), 80),
    title: clip(meta['og:title'] || meta['twitter:title'] || (title && decode(title)), 200),
    description: clip(meta['og:description'] || meta['twitter:description'] || meta.description, 350),
    image: absolute(meta['og:image:secure_url'] || meta['og:image'] || meta['twitter:image'] || meta['twitter:image:src']),
    themeColor: /^#[0-9a-f]{3,8}$/i.test(meta['theme-color'] ?? '') ? meta['theme-color'] : undefined,
  }
}

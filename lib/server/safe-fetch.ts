import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

const MAX_REDIRECTS = 3

/** Loopback, private, link-local, CGNAT, multicast and other non-public ranges */
const isPrivateAddress = (address: string): boolean => {
  if (address.startsWith('::ffff:')) return isPrivateAddress(address.slice(7)) // IPv4-mapped IPv6
  if (isIP(address) === 4) {
    const [a, b] = address.split('.').map(Number)
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19)) ||
      a >= 224
    )
  }
  const v6 = address.toLowerCase()
  return (
    v6 === '::' ||
    v6 === '::1' ||
    v6.startsWith('fc') ||
    v6.startsWith('fd') ||
    v6.startsWith('fe8') ||
    v6.startsWith('fe9') ||
    v6.startsWith('fea') ||
    v6.startsWith('feb') ||
    v6.startsWith('ff')
  )
}

/** Throws unless the URL is http(s) on a default port and resolves only to public IPs */
export const assertPublicUrl = async (url: URL) => {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('Unsupported protocol')
  if (url.port && url.port !== '80' && url.port !== '443') throw new Error('Unsupported port')
  if (url.username || url.password) throw new Error('Credentials in URL')
  const host = url.hostname.replace(/^\[|\]$/g, '')
  const addresses = isIP(host) ? [{ address: host }] : await lookup(host, { all: true, verbatim: true })
  if (!addresses.length || addresses.some(a => isPrivateAddress(a.address))) {
    throw new Error('Address not allowed')
  }
}

/**
 * fetch() for user-supplied URLs (SSRF-hardened): checks every redirect hop
 * against assertPublicUrl, times out, and only reads a bounded prefix.
 * Note: the DNS check and the connection resolve separately, so this narrows
 * but doesn't fully eliminate DNS-rebinding; fine for unfurling public links.
 */
export const safeFetchText = async (input: string, maxBytes: number, timeoutMs = 5000) => {
  let url = new URL(input)
  const signal = AbortSignal.timeout(timeoutMs)

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublicUrl(url)
    const res = await fetch(url, {
      redirect: 'manual',
      signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DiscordCloneBot/1.0; +link previews)',
        Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.5',
      },
    })

    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      url = new URL(res.headers.get('location')!, url)
      continue
    }
    if (!res.ok || !res.body) throw new Error(`Upstream responded ${res.status}`)

    const contentType = res.headers.get('content-type') ?? ''
    const reader = res.body.getReader()
    const chunks: Uint8Array[] = []
    let received = 0
    while (received < maxBytes) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      received += value.byteLength
    }
    void reader.cancel()
    const text = new TextDecoder().decode(Buffer.concat(chunks).subarray(0, maxBytes))
    return { url, contentType, text }
  }
  throw new Error('Too many redirects')
}

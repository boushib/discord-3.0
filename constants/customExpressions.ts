import type { CustomEmoji, CustomSticker } from '../models'

const svg = (markup: string) => `data:image/svg+xml,${encodeURIComponent(markup)}`

// Pixel creeper face, 8x8
const CREEPER = svg(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" shape-rendering="crispEdges"><rect width="8" height="8" fill="#5bbf3c"/><rect x="1" y="1" width="1" height="1" fill="#79d45a"/><rect x="5" y="6" width="2" height="1" fill="#79d45a"/><rect x="1" y="2" width="2" height="2" fill="#111"/><rect x="5" y="2" width="2" height="2" fill="#111"/><rect x="3" y="4" width="2" height="1" fill="#111"/><rect x="2" y="5" width="4" height="2" fill="#111"/><rect x="2" y="7" width="1" height="1" fill="#111"/><rect x="5" y="7" width="1" height="1" fill="#111"/></svg>`
)

const DIAMOND = svg(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M8 4h16l6 8-14 17L2 12z" fill="#4ee2ec"/><path d="M8 4l4 8h8l4-8M2 12h28M12 12l4 17 4-17" fill="none" stroke="#1aa6b7" stroke-width="1.5"/><path d="M10 6l3 5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>`
)

const LGTM = svg(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 32"><rect x="1" y="1" width="62" height="30" rx="8" fill="#238636"/><text x="32" y="22" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800" font-size="16" fill="#fff">LGTM</text></svg>`
)

const SHIPIT = svg(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 2c6 4 8 10 7 17l-3 4h-8l-3-4C8 12 10 6 16 2z" fill="#e6e9f2"/><circle cx="16" cy="12" r="3" fill="#5865f2"/><path d="M9 19l-4 6 6-1zM23 19l4 6-6-1z" fill="#ed4245"/><path d="M13 24c1 4 2 6 3 6s2-2 3-6z" fill="#faa61a"/></svg>`
)

const WORKS_ON_MY_MACHINE = svg(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><circle cx="80" cy="80" r="74" fill="#0f766e" stroke="#ccfbf1" stroke-width="6"/><rect x="45" y="44" width="70" height="46" rx="6" fill="#ccfbf1"/><rect x="51" y="50" width="58" height="34" rx="3" fill="#134e4a"/><path d="M62 67l8 8 18-18" stroke="#5eead4" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="38" y="92" width="84" height="8" rx="4" fill="#ccfbf1"/><text x="80" y="122" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800" font-size="12" fill="#ccfbf1">WORKS ON</text><text x="80" y="137" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800" font-size="12" fill="#ccfbf1">MY MACHINE</text></svg>`
)

export const SEED_EMOJIS: Record<string, CustomEmoji[]> = {
  's-minecraft': [
    { id: 'e-mc-creeper', name: 'creeper', url: CREEPER },
    { id: 'e-mc-diamond', name: 'diamond', url: DIAMOND },
  ],
  's-halcyon': [
    { id: 'e-hal-lgtm', name: 'lgtm', url: LGTM },
    { id: 'e-hal-shipit', name: 'shipit', url: SHIPIT },
  ],
}

export const SEED_STICKERS: Record<string, CustomSticker[]> = {
  's-halcyon': [{ id: 'st-hal-womm', name: 'Works On My Machine', url: WORKS_ON_MY_MACHINE }],
}

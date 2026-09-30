export interface Decoration {
  id: string
  name: string
  price: number
  /** CSS background for the animated ring around the avatar */
  background: string
}

export const DECORATIONS: Decoration[] = [
  { id: 'aurora', name: 'Aurora', price: 5.99, background: 'conic-gradient(#22d3ee, #a78bfa, #f472b6, #22d3ee)' },
  { id: 'sunset', name: 'Sunset', price: 4.99, background: 'conic-gradient(#f97316, #facc15, #ef4444, #f97316)' },
  { id: 'emerald', name: 'Emerald', price: 4.99, background: 'conic-gradient(#10b981, #a3e635, #059669, #10b981)' },
  { id: 'galaxy', name: 'Galaxy', price: 7.99, background: 'conic-gradient(#1e1b4b, #7c3aed, #ec4899, #1e1b4b)' },
  { id: 'gold', name: 'Golden Hour', price: 6.99, background: 'conic-gradient(#fde68a, #f59e0b, #fef3c7, #b45309, #fde68a)' },
  { id: 'ice', name: 'Frost', price: 3.99, background: 'conic-gradient(#e0f2fe, #7dd3fc, #ffffff, #38bdf8, #e0f2fe)' },
]

export const decorationById = (id?: string) => DECORATIONS.find(d => d.id === id)

/** "Dapper Community" -> "DC", "Assassin's Creed" -> "AC" */
export const initials = (name: string) =>
  name
    .replace(/'s\b/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word[0])
    .join('')
    .slice(0, 5)

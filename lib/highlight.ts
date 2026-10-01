import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import css from 'highlight.js/lib/languages/css'
import diff from 'highlight.js/lib/languages/diff'
import go from 'highlight.js/lib/languages/go'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import lua from 'highlight.js/lib/languages/lua'
import markdown from 'highlight.js/lib/languages/markdown'
import python from 'highlight.js/lib/languages/python'
import rust from 'highlight.js/lib/languages/rust'
import scss from 'highlight.js/lib/languages/scss'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'

// Only the languages people actually paste in chat, to keep the bundle small
const LANGUAGES = {
  bash, cpp, csharp, css, diff, go, java, javascript, json, lua,
  markdown, python, rust, scss, sql, typescript, xml, yaml,
}
for (const [name, language] of Object.entries(LANGUAGES)) hljs.registerLanguage(name, language)

/**
 * Returns highlighted HTML for a code block. highlight.js escapes the source,
 * so the result is safe to inject. Unknown languages fall back to detection.
 */
export const highlightCode = (code: string, lang?: string) => {
  if (lang && hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
  // Auto-detect only for longer snippets; short ones are often prose
  if (code.length < 20) return null
  const result = hljs.highlightAuto(code)
  return result.relevance >= 5 ? result.value : null
}

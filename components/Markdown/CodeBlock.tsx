'use client'

import { Check, Copy } from 'lucide-react'
import { useMemo, useState } from 'react'
import { highlightCode } from '../../lib/highlight'
import styles from './Markdown.module.sass'

/** Fenced code block with syntax highlighting and a copy button */
const CodeBlock = ({ code, lang }: { code: string; lang?: string }) => {
  const html = useMemo(() => highlightCode(code, lang), [code, lang])
  const [copied, setCopied] = useState(false)

  return (
    <pre className={styles.codeBlock} data-lang={lang}>
      <button
        type="button"
        className={styles.copy}
        aria-label="Copy code"
        onClick={() => {
          navigator.clipboard?.writeText(code)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      {html !== null ? (
        // highlight.js escapes the source before wrapping tokens in spans
        <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <code>{code}</code>
      )}
    </pre>
  )
}

export default CodeBlock

'use client'

import classNames from 'classnames'
import { Fragment, useState } from 'react'
import { useSelector } from '../../hooks'
import { ProfileTrigger } from '../Profile'
import styles from './Markdown.module.sass'

const INLINE =
  /\\([*_~`|\\>])|`([^`\n]+)`|\|\|(.+?)\|\||\*\*(.+?)\*\*|__(.+?)__|~~(.+?)~~|\*(?!\s)([^*]+?)\*|(?<![\w])_(?!\s)([^_]+?)_(?![\w])|(https?:\/\/[^\s<]+[^\s<.,:;"')\]])|@([\w.]+)/g

const EMOJI_ONLY = /^(?:\p{Extended_Pictographic}|\p{Emoji_Component}|‍|️|\s)+$/u

const Spoiler = ({ children }: { children: React.ReactNode }) => {
  const [revealed, setRevealed] = useState(false)
  return (
    <span
      role="button"
      tabIndex={0}
      className={classNames(styles.spoiler, revealed && styles.revealed)}
      onClick={() => setRevealed(true)}
      onKeyDown={e => e.key === 'Enter' && setRevealed(true)}
    >
      <span className={styles.spoilerText}>{children}</span>
    </span>
  )
}

const Mention = ({ name }: { name: string }) => {
  const user = useSelector(s =>
    Object.values(s.users.byId).find(u => u.username.toLowerCase() === name.toLowerCase())
  )
  if (name === 'everyone' || name === 'here') return <span className={styles.mention}>@{name}</span>
  if (!user) return <>@{name}</>
  return (
    <ProfileTrigger userId={user.id} className={styles.mention}>
      @{user.displayName}
    </ProfileTrigger>
  )
}

const parseInline = (text: string, keyPrefix = ''): React.ReactNode[] => {
  const nodes: React.ReactNode[] = []
  let last = 0
  let i = 0
  for (const match of text.matchAll(INLINE)) {
    const index = match.index ?? 0
    if (index > last) nodes.push(text.slice(last, index))
    const key = `${keyPrefix}${i++}`
    const [, escaped, code, spoiler, bold, underline, strike, italic, italic2, url, mention] = match
    if (escaped !== undefined) nodes.push(escaped)
    else if (code !== undefined) nodes.push(<code key={key} className={styles.inlineCode}>{code}</code>)
    else if (spoiler !== undefined) nodes.push(<Spoiler key={key}>{parseInline(spoiler, key)}</Spoiler>)
    else if (bold !== undefined) nodes.push(<strong key={key}>{parseInline(bold, key)}</strong>)
    else if (underline !== undefined) nodes.push(<u key={key}>{parseInline(underline, key)}</u>)
    else if (strike !== undefined) nodes.push(<s key={key}>{parseInline(strike, key)}</s>)
    else if (italic !== undefined || italic2 !== undefined)
      nodes.push(<em key={key}>{parseInline(italic ?? italic2, key)}</em>)
    else if (url !== undefined)
      nodes.push(
        <a key={key} href={url} target="_blank" rel="noreferrer noopener" className={styles.link}>
          {url}
        </a>
      )
    else if (mention !== undefined) nodes.push(<Mention key={key} name={mention} />)
    last = index + match[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

const renderLines = (text: string, keyPrefix: string) => {
  const lines = text.split('\n')
  const out: React.ReactNode[] = []
  let quote: string[] = []

  const flushQuote = (key: string) => {
    if (!quote.length) return
    out.push(
      <blockquote key={`q${key}`} className={styles.quote}>
        {quote.map((l, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {parseInline(l, `${key}q${i}`)}
          </Fragment>
        ))}
      </blockquote>
    )
    quote = []
  }

  lines.forEach((line, i) => {
    const key = `${keyPrefix}-${i}`
    if (line.startsWith('> ') || line === '>') {
      quote.push(line.slice(2))
      return
    }
    flushQuote(key)
    const heading = /^(#{1,3}) (.+)$/.exec(line)
    if (heading) {
      const Tag = `h${heading[1].length}` as 'h1' | 'h2' | 'h3'
      out.push(<Tag key={key} className={styles.heading}>{parseInline(heading[2], key)}</Tag>)
      return
    }
    const bullet = /^[-*] (.+)$/.exec(line)
    if (bullet) {
      out.push(<div key={key} className={styles.bullet}>{parseInline(bullet[1], key)}</div>)
      return
    }
    out.push(
      <Fragment key={key}>
        {parseInline(line, key)}
        {i < lines.length - 1 && !/^(#{1,3}) /.test(lines[i + 1]) && <br />}
      </Fragment>
    )
  })
  flushQuote('end')
  return out
}

/** Renders the subset of Discord markdown used in messages */
const Markdown = ({ content }: { content: string }) => {
  if (EMOJI_ONLY.test(content) && [...content.trim()].length <= 27) {
    return <span className={styles.jumbo}>{content}</span>
  }

  const parts = content.split(/```(?:(\w+)\n)?([\s\S]*?)```/g)
  const nodes: React.ReactNode[] = []
  for (let i = 0; i < parts.length; i += 3) {
    if (parts[i]) nodes.push(...renderLines(parts[i].replace(/^\n|\n$/g, ''), `t${i}`))
    if (i + 2 < parts.length) {
      nodes.push(
        <pre key={`c${i}`} className={styles.codeBlock} data-lang={parts[i + 1]}>
          <code>{parts[i + 2].replace(/\n$/, '')}</code>
        </pre>
      )
    }
  }
  return <>{nodes}</>
}

export default Markdown

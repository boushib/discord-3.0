'use client'

import { nanoid } from '@reduxjs/toolkit'
import { Plus, Trash } from 'lucide-react'
import { useState } from 'react'
import { CURRENT_USER_ID } from '../../constants'
import { useAppDispatch } from '../../hooks'
import { closeModal, sendMessage } from '../../store'
import { simulatePollVotes } from '../../store/simulate'
import Modal, { Button } from '../Modal'
import styles from './Modals.module.sass'

const DURATIONS = [
  { label: '1 hour', hours: 1 },
  { label: '4 hours', hours: 4 },
  { label: '8 hours', hours: 8 },
  { label: '24 hours', hours: 24 },
  { label: '3 days', hours: 72 },
  { label: '1 week', hours: 168 },
]

const PollModal = ({ channelId }: { channelId: string }) => {
  const dispatch = useAppDispatch()
  const [question, setQuestion] = useState('')
  const [answers, setAnswers] = useState(['', ''])
  const [hours, setHours] = useState(24)
  const [multiple, setMultiple] = useState(false)
  const close = () => dispatch(closeModal())
  const filled = answers.map(a => a.trim()).filter(Boolean)
  const valid = question.trim() && filled.length >= 2

  const post = () => {
    if (!valid) return
    const action = dispatch(
      sendMessage({
        channelId,
        authorId: CURRENT_USER_ID,
        content: '',
        poll: {
          question: question.trim(),
          options: filled.map(text => ({ id: nanoid(6), text, voterIds: [] })),
          multiple,
          endsAt: Date.now() + hours * 60 * 60 * 1000,
        },
      })
    )
    dispatch(simulatePollVotes(channelId, action.payload.id))
    close()
  }

  return (
    <Modal
      title="Create a Poll"
      onClose={close}
      size="medium"
      footer={
        <>
          <label className={styles.checkbox}>
            <input type="checkbox" checked={multiple} onChange={e => setMultiple(e.target.checked)} />
            Allow multiple answers
          </label>
          <Button onClick={post} disabled={!valid}>
            Post
          </Button>
        </>
      }
    >
      <label className={styles.field}>
        <span className={styles.label}>Question</span>
        <input
          autoFocus
          value={question}
          maxLength={300}
          placeholder="What question do you want to ask?"
          onChange={e => setQuestion(e.target.value)}
        />
      </label>
      <span className={styles.label}>Answers</span>
      <div className={styles.answers}>
        {answers.map((answer, i) => (
          <div key={i} className={styles.answer}>
            <input
              value={answer}
              maxLength={55}
              placeholder="Type your answer"
              onChange={e => setAnswers(answers.map((a, j) => (j === i ? e.target.value : a)))}
            />
            {answers.length > 2 && (
              <button
                type="button"
                aria-label="Remove answer"
                onClick={() => setAnswers(answers.filter((_, j) => j !== i))}
              >
                <Trash size={16} />
              </button>
            )}
          </div>
        ))}
        {answers.length < 10 && (
          <button type="button" className={styles.addAnswer} onClick={() => setAnswers([...answers, ''])}>
            <Plus size={16} /> Add another answer
          </button>
        )}
      </div>
      <label className={styles.field}>
        <span className={styles.label}>Duration</span>
        <select className={styles.select} value={hours} onChange={e => setHours(Number(e.target.value))}>
          {DURATIONS.map(d => (
            <option key={d.hours} value={d.hours}>
              {d.label}
            </option>
          ))}
        </select>
      </label>
    </Modal>
  )
}

export default PollModal

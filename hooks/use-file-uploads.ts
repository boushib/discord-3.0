import { useCallback } from 'react'
import { MAX_FILE_SIZE, toAttachment } from '../lib/files'
import { addUploads } from '../store'
import { useAppDispatch } from './use-selector'

/** Converts picked, pasted or dropped files into pending composer uploads */
export const useFileUploads = (channelId: string) => {
  const dispatch = useAppDispatch()
  return useCallback(
    async (files: FileList | File[]) => {
      const accepted = [...files].filter(f => f.size <= MAX_FILE_SIZE)
      if (accepted.length < files.length) {
        window.alert('Files must be 25 MB or smaller.')
      }
      if (!accepted.length) return
      const attachments = await Promise.all(accepted.map(toAttachment))
      dispatch(addUploads({ channelId, attachments }))
    },
    [channelId, dispatch]
  )
}

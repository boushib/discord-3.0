import { nanoid } from '@reduxjs/toolkit'
import type { Attachment } from '../models'

export const MAX_FILE_SIZE = 25 * 1024 * 1024
const MAX_INLINE_SIZE = 512 * 1024
const MAX_IMAGE_SIDE = 1280

const readAsDataURL = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })

/** Downscale images so they can be kept in localStorage */
const compressImage = async (file: File) => {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  // WebP keeps transparency and is far smaller than PNG (browsers without
  // WebP encoding fall back to PNG automatically)
  const url = canvas.toDataURL('image/webp', 0.85)
  return { url, width, height, type: url.slice(5, url.indexOf(';')) }
}

export const toAttachment = async (file: File): Promise<Attachment> => {
  const base = { id: `a-${nanoid(8)}`, name: file.name || 'image.png', type: file.type, size: file.size }
  // GIFs keep their animation, other images get resized
  if (file.type.startsWith('image/') && file.type !== 'image/gif') {
    try {
      return { ...base, ...(await compressImage(file)) }
    } catch {
      // Fall through for images the browser can't decode
    }
  }
  const url = file.size <= MAX_INLINE_SIZE ? await readAsDataURL(file) : URL.createObjectURL(file)
  return { ...base, url }
}

export const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} bytes`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

import { useEffect } from 'react'

export const useFixBodyScroll = () => {
  useEffect(() => {
    document.body.style.overflowY = 'hidden'
    return () => {
      document.body.style.overflowY = 'visible'
    }
  }, [])
}

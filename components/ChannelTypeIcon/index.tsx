import { Megaphone, Volume2 } from 'lucide-react'
import ChannelIcon from '../../icons/Channel'
import type { ChannelType } from '../../models'

interface Props {
  type: ChannelType
  size?: number
  className?: string
}

const ChannelTypeIcon = ({ type, size = 20, className }: Props) => {
  if (type === 'voice') return <Volume2 size={size} className={className} />
  if (type === 'announcement') return <Megaphone size={size - 2} className={className} />
  return (
    <span className={className} style={{ display: 'inline-flex' }}>
      <ChannelIcon width={size} height={size} />
    </span>
  )
}

export default ChannelTypeIcon

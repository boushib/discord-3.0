export const ME = '@me'

export const isMe = (serverId: string) => decodeURIComponent(serverId) === ME

export const serverHref = (serverId: string) => `/channels/${serverId}`
export const channelHref = (serverId: string, channelId: string) =>
  `/channels/${serverId}/${channelId}`
export const dmHref = (dmId: string) => `/channels/${ME}/${dmId}`

'use client'

import { useRouter } from 'next/navigation'
import { useAppDispatch, useSelector } from '../../hooks'
import { closeModal, leaveServer } from '../../store'
import Modal, { Button } from '../Modal'

const LeaveServerModal = ({ serverId }: { serverId: string }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const server = useSelector(s => s.servers.byId[serverId])
  const close = () => dispatch(closeModal())
  if (!server) return null

  return (
    <Modal
      title={`Leave '${server.name}'`}
      subtitle={
        <>
          Are you sure you want to leave <strong>{server.name}</strong>? You won’t be able to rejoin this server
          unless you are re-invited.
        </>
      }
      onClose={close}
      footer={
        <>
          <Button variant="link" onClick={close}>
            Cancel
          </Button>
          <Button
            variant="danger"
            autoFocus
            onClick={() => {
              close()
              router.push('/channels/@me')
              dispatch(leaveServer(serverId))
            }}
          >
            Leave Server
          </Button>
        </>
      }
    />
  )
}

export default LeaveServerModal

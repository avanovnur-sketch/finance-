import { Modal } from './Modal'
import { Button } from './Button'

interface Props {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Удалить', onConfirm, onCancel }: Props) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm text-muted">{message}</p>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel}>
          Отмена
        </Button>
        <Button variant="expense" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

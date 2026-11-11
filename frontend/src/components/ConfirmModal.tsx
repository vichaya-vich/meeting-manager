import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

const ConfirmModal = ({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Confirm cancel meeting</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure to cancel this meeting ?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm}>Confirm</Button>
        <Button onClick={onCancel} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmModal

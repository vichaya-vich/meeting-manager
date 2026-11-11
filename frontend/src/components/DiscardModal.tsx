import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

const DiscardModal = ({
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
      <DialogTitle>Discard changes</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You have made changes that haven't been saved yet. Are you sure to discard changes ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm}>Confirm</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default DiscardModal

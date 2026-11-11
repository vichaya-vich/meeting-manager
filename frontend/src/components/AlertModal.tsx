import { Alert, Snackbar, type AlertColor } from '@mui/material'

const AlertModal = ({
  message,
  open,
  severity = 'success',
  onClose,
}: {
  message: string
  open: boolean
  severity?: AlertColor
  onClose: () => void
}) => {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={5000}
      onClose={onClose}
    >
      <Alert severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default AlertModal

import AlertModal from '@/components/AlertModal'
import DiscardModal from '@/components/DiscardModal'
import { meetingQuery } from '@/queries/meetingQuery'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

const FeedbackModal = ({
  id,
  feedback,
  onCofirm,
  onCancel,
}: {
  id: number
  feedback?: string
  onCofirm: () => void
  onCancel: () => void
}) => {
  const [showDiscard, setShowDiscard] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const { control, handleSubmit, reset } = useForm<{ feedback: string }>({
    defaultValues: { feedback },
  })

  const mutation = meetingQuery.useFeedbackMutation()

  const onSubmit = ({ feedback }: { feedback: string }) => {
    mutation.mutate(
      { id, feedback },
      {
        onSuccess: () => {
          setShowAlert(true)
          reset()
          onCofirm()
        },
      },
    )
  }

  const onConfirmDiscard = () => {
    reset()
    setShowDiscard(false)
    onCancel()
  }

  return (
    <>
      <AlertModal
        message="Feedback is added."
        open={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <DiscardModal
        open={showDiscard}
        onConfirm={onConfirmDiscard}
        onCancel={() => setShowDiscard(false)}
      />
      <Dialog open fullWidth>
        <DialogTitle>Add Feedback</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} id="feedback">
            <Controller
              name="feedback"
              control={control}
              rules={{
                required: 'Feedback is required',
                maxLength: { value: 500, message: 'Feedback must be at most 500 characters' },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  minRows={3}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="submit" form="feedback" variant="contained">
            Submit
          </Button>
          <Button onClick={() => setShowDiscard(true)} variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default FeedbackModal

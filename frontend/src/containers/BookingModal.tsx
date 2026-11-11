import AlertModal from '@/components/AlertModal'
import DiscardModal from '@/components/DiscardModal'
import MeetingFormFields from '@/components/MeetingFormFields'
import type { MeetingFormType } from '@/interfaces/meetingForm'
import { candidateQuery } from '@/queries/candidateQuery'
import { meetingQuery } from '@/queries/meetingQuery'
import { combineDateTime } from '@/utils/dateUtil'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

const BookingModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [showDiscard, setShowDiscard] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const { control, handleSubmit, reset } = useForm<MeetingFormType>()
  const name = useWatch({ control, name: 'name', defaultValue: '' })

  const { data: names = [] } = candidateQuery.useGetNames(name.toLowerCase(), name.length >= 3)
  const mutation = meetingQuery.useCreateMeetingMutation()

  const onSubmit = (form: MeetingFormType) => {
    mutation.mutate(
      {
        name: form.name,
        role: form.role,
        startAt: combineDateTime(form.date, form.start),
        endAt: combineDateTime(form.date, form.end),
        type: form.type,
        note: form.note,
      },
      {
        onSuccess: () => {
          reset()
          setShowAlert(true)
          onClose()
        },
      },
    )
  }

  const onConfirmDiscard = () => {
    reset()
    setShowDiscard(false)
    onClose()
  }

  return (
    <>
      <AlertModal
        message="Booking is success."
        open={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <DiscardModal
        open={showDiscard}
        onConfirm={onConfirmDiscard}
        onCancel={() => setShowDiscard(false)}
      />
      <Dialog open={open} fullWidth>
        <DialogTitle>Schedule a New Meeting</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} id="booking">
            <MeetingFormFields control={control} names={names} />
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="submit" form="booking" variant="contained">
            Booking Meeting
          </Button>
          <Button onClick={() => setShowDiscard(true)} variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default BookingModal

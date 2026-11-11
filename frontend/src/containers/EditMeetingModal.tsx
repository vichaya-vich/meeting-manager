import AlertModal from '@/components/AlertModal'
import DiscardModal from '@/components/DiscardModal'
import MeetingFormFields from '@/components/MeetingFormFields'
import { MeetingStatus } from '@/constants/meetingStatus'
import type { MeetingUpdateFormType } from '@/interfaces/meetingForm'
import { candidateQuery } from '@/queries/candidateQuery'
import { meetingQuery } from '@/queries/meetingQuery'
import { combineDateTime } from '@/utils/dateUtil'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'

const EditMeetingModal = ({
  meeting,
  onCofirm,
  onCancel,
}: {
  meeting: MeetingUpdateFormType
  onCofirm: () => void
  onCancel: () => void
}) => {
  const [showDiscard, setShowDiscard] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const { control, handleSubmit, reset } = useForm<MeetingUpdateFormType>({
    defaultValues: meeting,
  })
  const name = useWatch({ control, name: 'name', defaultValue: '' })

  const { data: names = [] } = candidateQuery.useGetNames(name.toLowerCase(), name.length >= 3)

  const mutation = meetingQuery.useUpdateMeetingMutation(meeting.id)

  const onSubmit = (form: MeetingUpdateFormType) => {
    mutation.mutate(
      {
        name: form.name,
        role: form.role,
        startAt: combineDateTime(form.date, form.start),
        endAt: combineDateTime(form.date, form.end),
        type: form.type,
        status: form.status,
        note: form.note,
      },
      {
        onSuccess: () => {
          reset()
          setShowAlert(true)
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
        message="Meeting is updated."
        open={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <DiscardModal
        open={showDiscard}
        onConfirm={onConfirmDiscard}
        onCancel={() => setShowDiscard(false)}
      />
      <Dialog open fullWidth>
        <DialogTitle>Edit Meeting</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} id="booking">
            <Controller
              name="status"
              control={control}
              rules={{ required: 'Status is required' }}
              render={({ field, fieldState: { error } }) => (
                <FormControl
                  id="status-label"
                  error={!!error}
                  sx={{ marginTop: '5px', marginBottom: '4px', width: '100%' }}
                >
                  <InputLabel>Position</InputLabel>
                  <Select {...field} label="Position *">
                    <MenuItem disabled value="">
                      Position
                    </MenuItem>
                    <MenuItem value="PENDING">{MeetingStatus.PENDING}</MenuItem>
                    <MenuItem value="CONFIRM">{MeetingStatus.CONFIRM}</MenuItem>
                  </Select>
                  {!!error && (
                    <FormHelperText id="status-helper-text">{error?.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <MeetingFormFields control={control} names={names} />
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="submit" form="booking" variant="contained">
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

export default EditMeetingModal

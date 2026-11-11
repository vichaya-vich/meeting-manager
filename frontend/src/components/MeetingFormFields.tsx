import { MeetingType } from '@/constants/meetingType'
import { Role } from '@/constants/role'
import type { MeetingFormType } from '@/interfaces/meetingForm'
import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { DatePicker, TimePicker } from '@mui/x-date-pickers'
import dayjs, { isDayjs } from 'dayjs'
import { Controller, type Control } from 'react-hook-form'

const MeetingFormFields = <T extends MeetingFormType>({
  control,
  names,
}: {
  control: Control<T>
  names: string[]
}) => {
  const formControl = control as unknown as Control<MeetingFormType>

  return (
    <Stack spacing={1} sx={{ marginTop: '5px' }}>
      <Controller
        name="name"
        control={formControl}
        rules={{
          required: 'Candidate name is required',
          maxLength: { value: 50, message: 'Candidate name must be at most 50 characters' },
        }}
        render={({ field, fieldState: { error } }) => (
          <Autocomplete
            {...field}
            freeSolo
            options={names}
            onInputChange={(_, value) => {
              field.onChange(value)
            }}
            onChange={(_, value) => {
              field.onChange(value)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={field.ref}
                label="Candidate Name *"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        )}
      />

      <Controller
        name="role"
        control={formControl}
        rules={{ required: 'Position is required' }}
        render={({ field, fieldState: { error } }) => (
          <FormControl id="role-label" error={!!error}>
            <InputLabel>Position</InputLabel>
            <Select {...field} label="Position *">
              <MenuItem disabled value="">
                Position
              </MenuItem>
              {Object.entries(Role).map(([key, value]) => (
                <MenuItem value={key}>{value}</MenuItem>
              ))}
            </Select>
            {!!error && <FormHelperText id="role-helper-text">{error?.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <Controller
        name="date"
        control={formControl}
        rules={{
          required: 'Date is required',
          validate: (date) => {
            const isPast = date.startOf('day').isBefore(dayjs().startOf('day'))
            if (isPast) {
              return 'Date must not be in the past'
            }
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            {...field}
            label="Date *"
            minDate={dayjs()}
            maxDate={dayjs().add(3, 'month')}
            slotProps={{
              textField: {
                error: !!error,
                helperText: error?.message,
              },
            }}
          />
        )}
      />

      <Stack direction="row" spacing={1}>
        <Controller
          name="start"
          control={formControl}
          rules={{
            required: 'Start time is required',
            validate: (start, { date }) => {
              const now = dayjs()
              const isToday =
                isDayjs(date) && date.isValid() && date.startOf('day').isSame(now.startOf('day'))
              const startTime = start.hour() * 60 + start.minute()
              const currentTime = now.hour() * 60 + now.minute()
              const isPast = isToday && startTime < currentTime

              if (isPast) {
                return 'Start time must not be in the past'
              }
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TimePicker
              {...field}
              label="Start *"
              slotProps={{
                textField: { error: !!error, helperText: error?.message, fullWidth: true },
              }}
            />
          )}
        />

        <Controller
          name="end"
          control={formControl}
          rules={{
            required: 'End time is required',
            validate: (end, { start }) => {
              if (!isDayjs(start) || !start.isValid()) {
                return
              }

              const startTime = start.hour() * 60 + start.minute()
              const endTime = end.hour() * 60 + end.minute()
              console.log(startTime, endTime)

              if (startTime >= endTime) {
                return 'End time must be after start time'
              }
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TimePicker
              {...field}
              label="End *"
              slotProps={{
                textField: { error: !!error, helperText: error?.message, fullWidth: true },
              }}
            />
          )}
        />
      </Stack>

      <Controller
        name="type"
        control={formControl}
        rules={{ required: 'Meeting type is required' }}
        render={({ field, fieldState: { error } }) => (
          <FormControl id="type-label" error={!!error}>
            <FormLabel required id="type-label">
              Meeting Type
            </FormLabel>
            <RadioGroup {...field} row sx={{ justifyContent: 'space-evenly' }}>
              {Object.entries(MeetingType).map(([key, value]) => (
                <FormControlLabel key={key} value={key} control={<Radio />} label={value} />
              ))}
            </RadioGroup>
            {!!error && <FormHelperText id="type-helper-text">{error?.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <Controller
        name="note"
        control={formControl}
        rules={{ maxLength: { value: 500, message: 'Note must be at most 500 characters' } }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Note"
            fullWidth
            multiline
            minRows={3}
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
    </Stack>
  )
}

export default MeetingFormFields

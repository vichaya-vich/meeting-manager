import type { Dayjs } from 'dayjs'

export const combineDateTime = (date: Dayjs, time: Dayjs) => {
  const dateStr = date.format('YYYY-MM-DD')
  const timeStr = time.format('HH:mm')

  return new Date(`${dateStr}T${timeStr}`)
}

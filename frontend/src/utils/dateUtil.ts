import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

export const combineDateTime = (date: Dayjs, time: Dayjs) => {
  const dateStr = date.format('YYYY-MM-DD')
  const timeStr = time.format('HH:mm')

  return new Date(`${dateStr}T${timeStr}`)
}

export const formatDateTimeDisplay = (start: Date, end: Date) => {
  const dateTimeStart = dayjs(start).format('MMM DD, YYYY · HH:mm A')
  const timeEnd = dayjs(end).format('HH:mm A')
  return `${dateTimeStart} - ${timeEnd}`
}

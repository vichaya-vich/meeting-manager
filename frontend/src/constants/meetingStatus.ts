export const MeetingStatus = {
  PENDING: 'Pending',
  CONFIRM: 'Confirm',
  CANCELED: 'Canceled',
} as const

export type MeetingStatusKey = keyof typeof MeetingStatus

export const MeetingStatus = {
  PENDING: 'Pending',
  CONFIRM: 'Confirm',
} as const

export const MeetingStatusColor = {
  PENDING: 'yellow',
  CONFIRM: 'blue',
} as const

export type MeetingStatusKey = keyof typeof MeetingStatus

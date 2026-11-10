export const MeetingType = {
  ONLINE: 'Online',
  OFFLINE: 'Offline',
} as const

export type MeetingTypeKey = keyof typeof MeetingType

import { describe, expect, test } from 'vitest'
import { MeetingScope } from '../enums/meeting-scope.enum'
import { meetingListSchema } from './meeting-list.schema'

describe('meetingListSchema', () => {
  const query = { scope: MeetingScope.UPCOMING }

  test('should validate pass', () => {
    const result = meetingListSchema.safeParse({ query })
    expect(result.success).toBe(true)

    if (result.success) {
      const { query } = result.data
      expect(query.scope).toBe(MeetingScope.UPCOMING)
    }
  })

  test('should validate failed when scope is invalid', () => {
    const result = meetingListSchema.safeParse({ query: { scope: 'NOT_SCOPE' } })
    expect(result.success).toBe(false)

    if (!result.success) {
      const { issues } = result.error
      expect(issues.length).toBe(1)
      expect(issues[0]?.message).toBe('invalid scope')
      expect(issues[0]?.path).toEqual(['query', 'scope'])
    }
  })
})

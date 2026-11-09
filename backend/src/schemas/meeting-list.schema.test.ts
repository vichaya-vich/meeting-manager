import { describe, expect, test } from 'vitest'
import { MeetingScope } from '../enums/meeting-scope.enum'
import { meetingListSchema } from './meeting-list.schema'

describe('meetingListSchema', () => {
  const query = { scope: MeetingScope.UPCOMING, cursor: 1 }

  test('should validate pass', () => {
    const result = meetingListSchema.safeParse({ query })
    expect(result.success).toBe(true)

    if (result.success) {
      const { query } = result.data
      expect(query.scope).toBe(MeetingScope.UPCOMING)
      expect(query.cursor).toBe(1)
    }
  })

  test('should validate pass when cursor is undefined', () => {
    const result = meetingListSchema.safeParse({ query: { scope: MeetingScope.UPCOMING } })
    expect(result.success).toBe(true)
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

  test.for([
    ['cursor is not a number', 'a'],
    ['cursor is not an integer', '1.2'],
    ['cursor is not a positive number', '-123'],
  ])('should validate failed when %s', ([_label, cursor]) => {
    const result = meetingListSchema.safeParse({ query: { ...query, cursor } })
    expect(result.success).toBe(false)

    if (!result.success) {
      const { issues } = result.error
      expect(issues.length).toBe(1)
      expect(issues[0]?.message).toBe('cursor must be a positive integer')
      expect(issues[0]?.path).toEqual(['query', 'cursor'])
    }
  })
})

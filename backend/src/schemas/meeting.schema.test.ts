import { describe, expect, test } from 'vitest'
import { meetingSchema } from './meeting.schema'

describe('meetingSchema', () => {
  const params = { id: '123' }

  test('should validate pass and transform data', () => {
    const result = meetingSchema.safeParse({ params })
    expect(result.success).toBe(true)

    if (result.success) {
      const { params } = result.data
      expect(params.id).toBe(123)
    }
  })

  test.for([
    ['id is undefined', undefined],
    ['id is not a number', 'a'],
    ['id is not an integer', '1.2'],
    ['id is not a positive number', '-123'],
  ])('should validate failed when %s', ([_label, id]) => {
    const result = meetingSchema.safeParse({ params: { id } })
    expect(result.success).toBe(false)

    if (!result.success) {
      const { issues } = result.error
      expect(issues.length).toBe(1)
      expect(issues[0]?.message).toBe('id is required')
      expect(issues[0]?.path).toEqual(['params', 'id'])
    }
  })
})

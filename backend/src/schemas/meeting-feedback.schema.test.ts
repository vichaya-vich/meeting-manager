import { describe, expect, test } from 'vitest'
import { meetingFeedbackSchema } from './meeting-feedback.schema'

describe('meetingFeedbackSchema', () => {
  const params = { id: '123' }
  const body = { feedback: '  feedback1  ' }

  test('should validate pass and transform data', () => {
    const result = meetingFeedbackSchema.safeParse({ params, body })
    expect(result.success).toBe(true)

    if (result.success) {
      const { params, body } = result.data
      expect(params.id).toBe(123)
      expect(body.feedback).toBe('feedback1')
    }
  })

  test.for([
    ['id is undefined', undefined],
    ['id is not a number', 'a'],
    ['id is not an integer', '1.2'],
    ['id is not a positive number', '-123'],
  ])('should validate failed when %s', ([_label, id]) => {
    const result = meetingFeedbackSchema.safeParse({ params: { id }, body })
    expect(result.success).toBe(false)

    if (!result.success) {
      const { issues } = result.error
      expect(issues.length).toBe(1)
      expect(issues[0]?.message).toBe('id is required')
      expect(issues[0]?.path).toEqual(['params', 'id'])
    }
  })

  test.for([
    ['feedback is undefined', undefined, 'feedback is required'],
    ['feedback is not a string', 123, 'feedback is required'],
    ['feedback is blank', '', 'feedback must not be empty'],
    ['feedback is whitespace', '   ', 'feedback must not be empty'],
    ['feedback is too long', 'a'.repeat(501), 'feedback must be at most 500 characters'],
  ])('should validate failed when %s', ([_label, feedback, errorMessage]) => {
    const result = meetingFeedbackSchema.safeParse({ params, body: { ...body, feedback } })
    expect(result.success).toBe(false)

    if (!result.success) {
      const { issues } = result.error
      expect(issues.length).toBe(1)
      expect(issues[0]?.message).toBe(errorMessage)
      expect(issues[0]?.path).toEqual(['body', 'feedback'])
    }
  })
})

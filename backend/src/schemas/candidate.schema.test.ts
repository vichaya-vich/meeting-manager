import { describe, expect, test } from 'vitest'
import { Role } from '../enums/role.enum'
import { candidateSchema } from './candidate.schema'

describe('candidateSchema', () => {
  const params = { id: '123' }
  const query = { role: Role.BACKEND }

  test('should validate pass', () => {
    const result = candidateSchema.safeParse({ params, query })
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
    const result = candidateSchema.safeParse({ params: { id }, query })
    expect(result.success).toBe(false)

    if (!result.success) {
      const { issues } = result.error
      expect(issues.length).toBe(1)
      expect(issues[0]?.message).toBe('id is required')
      expect(issues[0]?.path).toEqual(['params', 'id'])
    }
  })

  test('should validate failed when scope is invalid', () => {
    const result = candidateSchema.safeParse({ params, query: { role: 'NOT_ROLE' } })
    expect(result.success).toBe(false)

    if (!result.success) {
      const { issues } = result.error
      expect(issues.length).toBe(1)
      expect(issues[0]?.message).toBe('invalid role')
      expect(issues[0]?.path).toEqual(['query', 'role'])
    }
  })
})

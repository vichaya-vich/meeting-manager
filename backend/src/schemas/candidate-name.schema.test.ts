import { describe, expect, test } from 'vitest'
import { candidateNameSchema } from './candidate-name.schema'

describe('candidateNameSchema', () => {
  const query = { name: 'name' }

  test('should validate pass', () => {
    const result = candidateNameSchema.safeParse({ query })
    expect(result.success).toBe(true)
  })

  test.for([
    ['name size is 3', 'aaa'],
    ['name size is 50', 'a'.repeat(50)],
  ])('should validate pass when %s', ([_label, name]) => {
    const result = candidateNameSchema.safeParse({ query: { name } })
    expect(result.success).toBe(true)
  })

  test.for([
    ['name is undefined', undefined, 'name is required'],
    ['name is not a string', 123, 'name is required'],
    ['name is blank', '', 'name must be at least 3 characters'],
    ['name is too short', 'aa', 'name must be at least 3 characters'],
    ['name is too long', 'a'.repeat(51), 'name must be at most 50 characters'],
  ])('should validate failed when %s', ([_label, name, errorMessage]) => {
    const result = candidateNameSchema.safeParse({ query: { name } })
    expect(result.success).toBe(false)

    if (!result.success) {
      const { issues } = result.error
      expect(issues.length).toBe(1)
      expect(issues[0]?.message).toBe(errorMessage)
      expect(issues[0]?.path).toEqual(['query', 'name'])
    }
  })
})

import { describe, expect, test } from 'vitest'
import { trimAndLowercase } from './string.util'

describe('trimAndLowercase', () => {
  test('should trim and lowercase', () => {
    const result = trimAndLowercase('  John Doe  ')
    expect(result).toBe('john doe')
  })
})

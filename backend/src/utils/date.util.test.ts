import { describe, expect, test } from 'vitest'
import { truncateToMinute } from './date.util'

describe('truncateToMinute', () => {
  test('should truncate to minute', () => {
    const result = truncateToMinute(new Date('2026-11-08T15:11:54+07:00'))
    expect(result).toEqual(new Date('2026-11-08T15:11:00+07:00'))
  })
})

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { MeetingCreateRequestDto } from '../dto/meeting-request.dto'
import { Role } from '../enums/role.enum'
import { MeetingType } from '../generated/prisma/client'
import { meetingCreateSchema } from './meeting-create.schema'

describe('meetingCreateSchema', () => {
  const body: MeetingCreateRequestDto = {
    name: '  John Doe  ',
    type: MeetingType.OFFLINE,
    startAt: new Date('2026-11-10T15:12:55+07:00'),
    endAt: new Date('2026-11-10T17:11:59+07:00'),
    role: Role.FRONTEND,
    note: '  note  ',
  }

  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date('2026-11-08T15:00:00+07:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should validate pass and transform data', () => {
    const result = meetingCreateSchema.safeParse({ body })
    expect(result.success).toBe(true)

    if (result.success) {
      const { body } = result.data
      expect(body.name).toBe('John Doe')
      expect(body.type).toBe(MeetingType.OFFLINE)
      expect(body.startAt).toEqual(new Date('2026-11-10T15:12:00+07:00'))
      expect(body.endAt).toEqual(new Date('2026-11-10T17:11:00+07:00'))
      expect(body.role).toBe(Role.FRONTEND)
      expect(body.note).toBe('note')
    }
  })

  test.for([
    ['name size is 1', 'a'],
    ['name size is 50', 'a'.repeat(50)],
  ])('should validate pass when %s', ([_label, name]) => {
    const result = meetingCreateSchema.safeParse({ body: { ...body, name } })
    expect(result.success).toBe(true)
  })

  test('should validate pass when startAt is today', () => {
    const result = meetingCreateSchema.safeParse({
      body: { ...body, startAt: new Date('2026-11-08T15:00:20+07:00') },
    })
    expect(result.success).toBe(true)
  })

  test.for([
    ['note is undefined', undefined],
    ['note is blank', ''],
    ['note is whitespace', '   '],
    ['note size is 500', 'a'.repeat(500)],
  ])('should validate pass when %s', ([_label, note]) => {
    const result = meetingCreateSchema.safeParse({ body: { ...body, note } })
    expect(result.success).toBe(true)
  })

  test.for([
    ['name is undefined', undefined, 'name is required'],
    ['name is not a string', 123, 'name is required'],
    ['name is blank', '', 'name must not be empty'],
    ['name is whitespace', '   ', 'name must not be empty'],
    ['name is too long', 'a'.repeat(51), 'name must be at most 50 characters'],
  ])('should validate failed when %s', ([_label, name, errorMessage]) => {
    const result = meetingCreateSchema.safeParse({ body: { ...body, name } })
    expect(result.success).toBe(false)

    if (!result.success) {
      const { issues } = result.error
      expect(issues.length).toBe(1)
      expect(issues[0]?.message).toBe(errorMessage)
      expect(issues[0]?.path).toEqual(['body', 'name'])
    }
  })

  test.for([
    ['type is undefined', undefined],
    ['type is not enum', 'NOT_ENUM'],
  ])('should validate failed when %s', ([_label, type]) => {
    const result = meetingCreateSchema.safeParse({ body: { ...body, type } })
    expect(result.success).toBe(false)

    if (!result.success) {
      const { issues } = result.error
      expect(issues.length).toBe(1)
      expect(issues[0]?.message).toBe('invalid meeting type')
      expect(issues[0]?.path).toEqual(['body', 'type'])
    }
  })

  test.for([
    ['startAt is undefined', undefined, 'startAt must be a valid date'],
    ['startAt is not a valid date', '2026/11/10T15:00:00+07:00', 'startAt must be a valid date'],
    ['startAt is in the past', '2026-11-07T15:00:00+07:00', 'startAt must not be in the past'],
  ])('should validate failed when %s', ([_label, startAt, errorMessage]) => {
    const result = meetingCreateSchema.safeParse({ body: { ...body, startAt } })
    expect(result.success).toBe(false)

    if (!result.success) {
      const { issues } = result.error
      expect(issues.length).toBe(1)
      expect(issues[0]?.message).toBe(errorMessage)
      expect(issues[0]?.path).toEqual(['body', 'startAt'])
    }
  })

  test.for([
    ['endAt is undefined', undefined, 'endAt must be a valid date'],
    ['endAt is not a valid date', '2026/11/10T15:00:00+07:00', 'endAt must be a valid date'],
    ['endAt is equal to startAt', '2026-11-10T15:12:59+07:00', 'endAt must be after startAt'],
    ['endAt is before startAt', '2026-11-10T12:00:00+07:00', 'endAt must be after startAt'],
  ])('should validate failed when %s', ([_label, endAt, errorMessage]) => {
    const result = meetingCreateSchema.safeParse({ body: { ...body, endAt } })
    expect(result.success).toBe(false)

    if (!result.success) {
      const { issues } = result.error
      expect(issues.length).toBe(1)
      expect(issues[0]?.message).toBe(errorMessage)
      expect(issues[0]?.path).toEqual(['body', 'endAt'])
    }
  })

  test.for([
    ['role is undefined', undefined],
    ['role is not enum', 'NOT_ENUM'],
  ])('should validate failed when %s', ([_label, role]) => {
    const result = meetingCreateSchema.safeParse({ body: { ...body, role } })
    expect(result.success).toBe(false)

    if (!result.success) {
      const { issues } = result.error
      expect(issues.length).toBe(1)
      expect(issues[0]?.message).toBe('invalid role')
      expect(issues[0]?.path).toEqual(['body', 'role'])
    }
  })

  test.for([
    ['note is not a string', 123, 'note must be a string'],
    ['note is too long', 'a'.repeat(501), 'note must be at most 500 characters'],
  ])('should validate failed when %s', ([_label, note, errorMessage]) => {
    const result = meetingCreateSchema.safeParse({ body: { ...body, note } })
    expect(result.success).toBe(false)

    if (!result.success) {
      const { issues } = result.error
      expect(issues.length).toBe(1)
      expect(issues[0]?.message).toBe(errorMessage)
      expect(issues[0]?.path).toEqual(['body', 'note'])
    }
  })
})

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { MeetingUpdateRequestDto } from '../dto/meeting-request.dto'
import { Role } from '../enums/role.enum'
import { MeetingStatus, MeetingType } from '../generated/prisma/client'
import { meetingUpdateSchema } from './meeting-update.schema'

describe('meetingUpdateSchema', () => {
  const params = { id: '123' }
  const body: MeetingUpdateRequestDto = {
    name: '  John Doe  ',
    type: MeetingType.OFFLINE,
    startAt: new Date('2026-11-10T15:12:55+07:00'),
    endAt: new Date('2026-11-10T17:11:59+07:00'),
    role: Role.FRONTEND,
    note: '  note  ',
    status: MeetingStatus.CONFIRM,
  }

  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date('2026-11-08T15:00:00+07:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should validate pass and transform data', () => {
    const result = meetingUpdateSchema.safeParse({ params, body })
    expect(result.success).toBe(true)

    if (result.success) {
      const { params, body } = result.data
      expect(params.id).toBe(123)
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
    const result = meetingUpdateSchema.safeParse({ params, body: { ...body, name } })
    expect(result.success).toBe(true)
  })

  test('should validate pass when startAt is today', () => {
    const result = meetingUpdateSchema.safeParse({
      params,
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
    const result = meetingUpdateSchema.safeParse({ params, body: { ...body, note } })
    expect(result.success).toBe(true)
  })

  test.for([
    ['id is undefined', undefined],
    ['id is not a number', 'a'],
    ['id is not an integer', '1.2'],
    ['id is not a positive number', '-123'],
  ])('should validate failed when %s', ([_label, id]) => {
    const result = meetingUpdateSchema.safeParse({ params: { id }, body })
    expect(result.success).toBe(false)

    if (!result.success) {
      const { issues } = result.error
      expect(issues.length).toBe(1)
      expect(issues[0]?.message).toBe('id is required')
      expect(issues[0]?.path).toEqual(['params', 'id'])
    }
  })

  test.for([
    ['name is undefined', undefined, 'name is required'],
    ['name is not a string', 123, 'name is required'],
    ['name is blank', '', 'name must not be empty'],
    ['name is whitespace', '   ', 'name must not be empty'],
    ['name is too long', 'a'.repeat(51), 'name must be at most 50 characters'],
  ])('should validate failed when %s', ([_label, name, errorMessage]) => {
    const result = meetingUpdateSchema.safeParse({ params, body: { ...body, name } })
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
    const result = meetingUpdateSchema.safeParse({ params, body: { ...body, type } })
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
    const result = meetingUpdateSchema.safeParse({ params, body: { ...body, startAt } })
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
    const result = meetingUpdateSchema.safeParse({ params, body: { ...body, endAt } })
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
    const result = meetingUpdateSchema.safeParse({ params, body: { ...body, role } })
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
    const result = meetingUpdateSchema.safeParse({ params, body: { ...body, note } })
    expect(result.success).toBe(false)

    if (!result.success) {
      const { issues } = result.error
      expect(issues.length).toBe(1)
      expect(issues[0]?.message).toBe(errorMessage)
      expect(issues[0]?.path).toEqual(['body', 'note'])
    }
  })

  test.for([
    ['status is undefined', undefined],
    ['status is not enum', 'NOT_ENUM'],
    ['status is CANCELED', MeetingStatus.CANCELED],
  ])('should validate failed when %s', ([_label, status]) => {
    const result = meetingUpdateSchema.safeParse({ params, body: { ...body, status } })
    expect(result.success).toBe(false)

    if (!result.success) {
      const { issues } = result.error
      expect(issues.length).toBe(1)
      expect(issues[0]?.message).toBe('invalid status')
      expect(issues[0]?.path).toEqual(['body', 'status'])
    }
  })
})

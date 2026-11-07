import { NextFunction, Request, Response } from 'express'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { z, ZodError } from 'zod'
import { validateData } from './validation.middleware'

const schema = z.object({
  body: z.object({ name: z.string().trim() }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  headers: z.object({}).optional(),
})

describe('validateData', () => {
  const request = { body: { name: '  John Doe  ' }, params: {}, query: {}, headers: {} } as Request
  const response = {} as Response
  let next: NextFunction

  beforeEach(() => {
    next = vi.fn()
  })

  afterEach(() => vi.clearAllMocks())

  test('should validate pass and transform body', () => {
    validateData(schema)(request, response, next)

    expect(request.body).toEqual({ name: 'John Doe' })
    expect(next).toHaveBeenCalledWith()
  })

  test('should validate failed and pass error to next', () => {
    const invalidRequest = { ...request, body: { name: 123 } } as Request
    validateData(schema)(invalidRequest, response, next)

    expect(next).toHaveBeenCalledWith(expect.any(ZodError))
  })
})

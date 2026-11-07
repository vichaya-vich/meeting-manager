import { NextFunction, Request, Response } from 'express'
import { afterEach } from 'node:test'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import z from 'zod'
import { Prisma } from '../generated/prisma/client'
import { errorHandler } from './error.handler'

describe('errorHandler', () => {
  const request = { method: 'POST', originalUrl: 'originalUrl1' } as Request
  let response: Response
  let next: NextFunction

  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})

    response = {
      headersSent: false,
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response
    next = vi.fn()
  })

  afterEach(() => vi.clearAllMocks())

  test('should pass error to next when headersSent is true', () => {
    const error = new Error('error')
    response.headersSent = true

    errorHandler(error, request, response, next)

    expect(next).toHaveBeenCalledWith(error)
    expect(response.status).not.toHaveBeenCalled()
  })

  test('should response status 400 when request body is invalid', () => {
    const error = new SyntaxError('error') as SyntaxError & { body: string }
    error.body = '{ invalid request body }'

    errorHandler(error, request, response, next)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ error: 'Invalid Syntax' })
  })

  test('should response status 400 when validate failed', () => {
    const result = z.object({ name: z.string('invalid') }).safeParse({ name: 123 })

    errorHandler(result.error, request, response, next)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      error: 'Invalid Input Data',
      details: [{ field: 'name', message: 'invalid' }],
    })
  })

  test('should respond status 409 when insert duplicate data', () => {
    const error = new Prisma.PrismaClientKnownRequestError('dup', {
      code: 'P2002',
      clientVersion: 'clientVersion1',
      meta: { data: 'data1' },
    })

    errorHandler(error, request, response, next)

    expect(response.status).toHaveBeenCalledWith(409)
    expect(response.json).toHaveBeenCalledWith({ error: 'Duplicate Data' })
  })

  test('should respond status 404 when data not found', () => {
    const error = new Prisma.PrismaClientKnownRequestError('nf', {
      code: 'P2025',
      clientVersion: 'clientVersion1',
    })

    errorHandler(error, request, response, next)

    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({ error: 'Data Not found' })
  })

  test('should respond status 500 when unknown error', () => {
    const error = new Error('error')

    errorHandler(error, request, response, next)

    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})

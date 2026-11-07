import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '../generated/prisma/client'

export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (response.headersSent) {
    return next(error)
  }

  const requestDetail = { method: request.method, url: request.originalUrl }

  if (error instanceof SyntaxError && 'body' in error) {
    console.warn('[400] Invalid Syntax', requestDetail)
    return response.status(400).json({ error: 'Invalid Syntax' })
  }

  if (error instanceof ZodError) {
    console.warn('[400] Invalid input', { ...requestDetail, issues: error.issues })
    return response.status(400).json({
      error: 'Invalid Input Data',
      details: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    })
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      console.warn('[409] Duplicate', { ...requestDetail, meta: error.meta })
      return response.status(409).json({ error: 'Duplicate Data' })
    }

    if (error.code === 'P2025') {
      console.warn('[404] Not found', requestDetail)
      return response.status(404).json({ error: 'Data Not found' })
    }
  }

  console.error('[500] Internal Server Error', requestDetail, error)
  response.status(500).json({ error: 'Internal Server Error' })
}

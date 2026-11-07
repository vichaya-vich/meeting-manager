import { NextFunction, Request, Response } from 'express'
import { ZodObject } from 'zod'

export function validateData(schema: ZodObject) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query,
      headers: request.headers,
    })

    if (!result.success) {
      return next(result.error)
    }

    if (result.data.body !== undefined) {
      request.body = result.data.body
    }

    next()
  }
}

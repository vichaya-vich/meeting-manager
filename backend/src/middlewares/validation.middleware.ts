import { NextFunction, Request, Response } from 'express'
import { ZodError, ZodObject } from 'zod'

export function validateData(schema: ZodObject) {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: request.body,
        params: request.params,
        query: request.query,
        headers: request.headers,
      })

      if (parsed.body !== undefined) {
        request.body = parsed.body
      }

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        console.error(`[400] ${request.method} ${request.originalUrl} - Invalid data`, error.issues)
        return response.status(400).json(
          error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        )
      } else {
        console.error(
          `[500] ${request.method} ${request.originalUrl} - Internal Server Error`,
          error,
        )
        return response.status(500).json({ error: 'Internal Server Error' })
      }
    }
  }
}

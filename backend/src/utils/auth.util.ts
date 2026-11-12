import jwt, { SignOptions } from 'jsonwebtoken'
import { randomBytes } from 'node:crypto'
import { ApplicationError } from '../handlers/error.handler'

const JWT_SECRET = process.env.JWT_SECRET
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL ?? '1h'
const REFRESH_TOKEN_TTL_DAYS = process.env.REFRESH_TOKEN_TTL_DAYS ?? '30'

export const signAccessToken = (userId: number, sessionId: string) => {
  if (!JWT_SECRET) {
    throw new ApplicationError('Secret is missing')
  }

  return jwt.sign({ sub: userId, sid: sessionId }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  } as SignOptions)
}

export const newRefreshSecret = () => {
  return randomBytes(32).toString('base64url')
}

export const refreshExpiry = () => {
  const days = Number(REFRESH_TOKEN_TTL_DAYS)
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}

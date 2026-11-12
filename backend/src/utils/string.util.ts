import { hash as argon2Hash, argon2id } from 'argon2'
import { createHash } from 'node:crypto'

export const trimAndLowercase = (value: string) => value.trim().toLowerCase()

export const sha256 = (value: string) => createHash('sha256').update(value).digest('hex')

export const hash = (value: string) => argon2Hash(value, { type: argon2id })

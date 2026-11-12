import express from 'express'
import { AuthController } from '../controllers/auth.controller'
import { PrismaClient } from '../generated/prisma/client'
import { SessionRepository } from '../repositories/session.repository'
import { UserRepository } from '../repositories/user.repository'
import { AuthService } from '../services/auth.service'

export const authRouter = (prisma: PrismaClient) => {
  const router = express.Router()
  const sessionRepository = new SessionRepository(prisma)
  const userRepository = new UserRepository(prisma)
  const service = new AuthService(userRepository, sessionRepository)
  const controller = new AuthController(service)

  router.post('/login', controller.login)
  router.post('/refresh', controller.refresh)

  return router
}

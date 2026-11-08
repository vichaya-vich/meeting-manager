import express from 'express'
import { CandidateController } from '../controllers/candidate.controller'
import { PrismaClient } from '../generated/prisma/client'
import { validateData } from '../middlewares/validation.middleware'
import { CandidateRepository } from '../repositories/candidate.repository'
import { candidateNameSchema } from '../schemas/candidate-name.schema'
import { CandidateService } from '../services/candidate.service'

export const meetingRouter = (prisma: PrismaClient) => {
  const router = express.Router()
  const repository = new CandidateRepository(prisma)
  const service = new CandidateService(repository)
  const controller = new CandidateController(service)

  router.get('/names', validateData(candidateNameSchema), controller.getCandidateNames)

  return router
}

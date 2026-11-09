import { RequestHandler } from 'express'
import { Role } from '../enums/role.enum'
import { CandidateService } from '../services/candidate.service'

export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  getCandidateNames: RequestHandler<{}, {}, {}, { name: string }> = async (
    request,
    response,
    next,
  ): Promise<void> => {
    try {
      const result = await this.candidateService.findCandidateNames(request.query.name)
      response.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  getCandidate: RequestHandler<{ id: string }, {}, {}, { role: string }> = async (
    request,
    response,
    next,
  ): Promise<void> => {
    try {
      const id = Number(request.params.id)
      const role = request.query.role as Role
      const result = await this.candidateService.findCandidate(id, role)
      response.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}

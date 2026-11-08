import { RequestHandler } from 'express'
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
}

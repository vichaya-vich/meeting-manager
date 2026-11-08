import { CandidateRepository } from '../repositories/candidate.repository'

export class CandidateService {
  constructor(private readonly candidateRepository: CandidateRepository) {}

  async findCandidateNames(name: string): Promise<string[]> {
    const candidates = await this.candidateRepository.findManyByName(name)
    return candidates.map(({ name }) => name)
  }
}

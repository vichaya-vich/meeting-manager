import { PrismaClient } from '../generated/prisma/client'

export class CandidateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findManyByName(name: string) {
    return this.prisma.candidate.findMany({ where: { name: { startsWith: name } } })
  }
}

import { PrismaClient } from '../generated/prisma/client'

export class CandidateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findByIdAndRoleWithMeeting(id: number, role: string) {
    return this.prisma.candidate.findUnique({
      where: { id, meetings: { some: { role } } },
      include: { meetings: { where: { role } } },
    })
  }

  findManyByName(name: string) {
    return this.prisma.candidate.findMany({ where: { nameNormalized: { startsWith: name } } })
  }
}

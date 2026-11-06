import { PrismaClient } from '../generated/prisma/client'
import { CreateMeetingWithCandidateInput } from '../interfaces/meeting.interface'
import { trimAndLowercase } from '../utils/string.util'

export class MeetingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  createWithCandidate(input: CreateMeetingWithCandidateInput) {
    const { name, ...meeting } = input
    const nameNormalized = trimAndLowercase(name)

    return this.prisma.meeting.create({
      data: {
        ...meeting,
        candidate: {
          connectOrCreate: {
            where: { nameNormalized },
            create: { name, nameNormalized },
          },
        },
      },
      include: { candidate: true },
    })
  }
}

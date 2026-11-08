import { Prisma, PrismaClient } from '../generated/prisma/client'
import {
  CreateMeetingWithCandidateInput,
  UpdateMeetingWithCandidateInput,
} from '../interfaces/meeting.interface'
import { trimAndLowercase } from '../utils/string.util'

export class MeetingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findById(id: number) {
    return this.prisma.meeting.findUnique({ where: { id } })
  }

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

  updateWithCandidate(id: number, input: UpdateMeetingWithCandidateInput) {
    const { name, ...meeting } = input
    const nameNormalized = trimAndLowercase(name)

    return this.prisma.meeting.update({
      where: { id },
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

  update(id: number, input: Prisma.MeetingUpdateInput) {
    return this.prisma.meeting.update({ where: { id }, data: input })
  }
}

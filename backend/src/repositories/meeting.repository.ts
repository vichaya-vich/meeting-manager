import { Prisma, PrismaClient } from '../generated/prisma/client'
import {
  CreateMeetingWithCandidateInput,
  MeetingsParams,
  UpdateMeetingWithCandidateInput,
} from '../interfaces/meeting.interface'
import { trimAndLowercase } from '../utils/string.util'

const meetingWithCandidate = {
  include: { candidate: true },
}

interface MeetingPagination {
  cursor?: Prisma.MeetingWhereUniqueInput
  skip?: number
  take?: number
}

export type MeetingWithCandidate = Prisma.MeetingGetPayload<typeof meetingWithCandidate>

export class MeetingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findById(id: number) {
    return this.prisma.meeting.findUnique({ where: { id } })
  }

  findByIdWithCandidate(id: number) {
    return this.prisma.meeting.findUnique({ where: { id }, ...meetingWithCandidate })
  }

  findManyWithCandidate(
    params: MeetingsParams,
    orderBy: Prisma.MeetingOrderByWithRelationInput,
    cursor?: number,
    take?: number,
  ) {
    const where: Prisma.MeetingWhereInput = {}
    const pagination: MeetingPagination = {}

    if (params.statuses?.length) {
      where.status = { in: params.statuses }
    }

    if (params.endBefore || params.endAfter) {
      where.endAt = {
        ...(params.endBefore && { lte: params.endBefore }),
        ...(params.endAfter && { gt: params.endAfter }),
      }
    }

    if (params.candidateId !== undefined) {
      where.candidateId = params.candidateId
    }

    if (cursor !== undefined) {
      pagination.cursor = { id: cursor }
      pagination.skip = 1
    }

    if (take !== undefined) {
      pagination.take = take
    }

    return this.prisma.meeting.findMany({ where, orderBy, ...pagination, ...meetingWithCandidate })
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
      ...meetingWithCandidate,
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
      ...meetingWithCandidate,
    })
  }

  update(id: number, input: Prisma.MeetingUpdateInput) {
    return this.prisma.meeting.update({ where: { id }, data: input })
  }
}

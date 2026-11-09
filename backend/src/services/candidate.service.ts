import { CandidateResponseDto } from '../dto/candidate-response.dto'
import { MeetingResponseDto } from '../dto/meeting-response.dto'
import { Role } from '../enums/role.enum'
import { MeetingStatus, Prisma } from '../generated/prisma/client'
import { ApplicationError } from '../handlers/error.handler'
import { CandidateRepository } from '../repositories/candidate.repository'

export class CandidateService {
  constructor(private readonly candidateRepository: CandidateRepository) {}

  async findCandidateNames(name: string): Promise<string[]> {
    const candidates = await this.candidateRepository.findManyByName(name)
    return candidates.map(({ name }) => name)
  }

  async findCandidate(id: number, role: Role): Promise<CandidateResponseDto> {
    const candidate = await this.candidateRepository.findByIdAndRoleWithMeeting(id, role)

    if (!candidate) {
      throw new ApplicationError('Candidate Not Found')
    }

    const currentDate = new Date().getTime()
    const upcomings: MeetingResponseDto[] = []
    const histories: MeetingResponseDto[] = []
    candidate.meetings.forEach((meeting) => {
      const response = this.mappingMeetingResponse(candidate.id, candidate.name, meeting)

      const isUpcoming =
        meeting.status !== MeetingStatus.CANCELED && meeting.endAt.getTime() > currentDate
      if (isUpcoming) {
        upcomings.push(response)
      } else {
        histories.push(response)
      }
    })

    return {
      id: candidate.id,
      name: candidate.name,
      role,
      upcomings,
      histories,
    }
  }

  private mappingMeetingResponse(
    candidateId: number,
    name: string,
    meeting: Prisma.MeetingModel,
  ): MeetingResponseDto {
    return {
      id: meeting.id,
      name,
      candidateId: candidateId,
      type: meeting.type,
      status: meeting.status,
      startAt: meeting.startAt,
      endAt: meeting.endAt,
      role: meeting.role,
      note: meeting.note,
      feedback: meeting.feedback,
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    }
  }
}

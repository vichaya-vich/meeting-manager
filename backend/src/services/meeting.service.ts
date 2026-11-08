import { MeetingCreateRequestDto, MeetingUpdateRequestDto } from '../dto/meeting-request.dto'
import { MeetingResponseDto } from '../dto/meeting-response.dto'
import { MeetingStatus } from '../generated/prisma/enums'
import { ApplicationError } from '../handlers/error.handler'
import { MeetingRepository } from '../repositories/meeting.repository'
import { truncateToMinute } from '../utils/date.util'

export class MeetingService {
  constructor(private readonly meetingRepository: MeetingRepository) {}

  async createMeeting(request: MeetingCreateRequestDto): Promise<MeetingResponseDto> {
    const meeting = await this.meetingRepository.createWithCandidate({
      ...request,
      status: MeetingStatus.PENDING,
    })

    const { candidate } = meeting

    return {
      id: meeting.id,
      name: candidate.name,
      candidateId: candidate.id,
      type: meeting.type,
      status: meeting.status,
      startAt: meeting.startAt,
      endAt: meeting.endAt,
      role: meeting.role,
      note: meeting.note,
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    }
  }

  async updateMeeting(id: number, request: MeetingUpdateRequestDto): Promise<MeetingResponseDto> {
    const existing = await this.meetingRepository.findById(id)
    if (!existing) {
      throw new ApplicationError('Meeting Not Found')
    }

    const currentDate = truncateToMinute(new Date()).getTime()
    if (existing.status === MeetingStatus.CANCELED || currentDate > existing.endAt.getTime()) {
      throw new ApplicationError('Not Allow to Update This Meeting')
    }

    const meeting = await this.meetingRepository.updateWithCandidate(id, request)

    const { candidate } = meeting

    return {
      id: meeting.id,
      name: candidate.name,
      candidateId: candidate.id,
      type: meeting.type,
      status: meeting.status,
      startAt: meeting.startAt,
      endAt: meeting.endAt,
      role: meeting.role,
      note: meeting.note,
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    }
  }
}

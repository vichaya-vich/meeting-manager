import { MeetingCreateRequestDto } from '../dto/meeting-request.dto'
import { MeetingResponseDto } from '../dto/meeting-response.dto'
import { MeetingStatus } from '../generated/prisma/enums'
import { MeetingRepository } from '../repositories/meeting.repository'

export class MeetingService {
  constructor(private readonly meetingRepository: MeetingRepository) {}

  async createMeeting(request: MeetingCreateRequestDto): Promise<MeetingResponseDto> {
    const meeting = await this.meetingRepository.createWithCandidate({
      ...request,
      role: request.role.toString(),
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
}

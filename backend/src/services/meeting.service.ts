import { MeetingCreateRequestDto, MeetingUpdateRequestDto } from '../dto/meeting-request.dto'
import { MeetingResponseDto, MeetingUpdateResponseDto } from '../dto/meeting-response.dto'
import { MeetingScope } from '../enums/meeting-scope.enum'
import { Prisma } from '../generated/prisma/client'
import { MeetingStatus } from '../generated/prisma/enums'
import { ApplicationError } from '../handlers/error.handler'
import { MeetingsParams } from '../interfaces/meeting.interface'
import { MeetingRepository, MeetingWithCandidate } from '../repositories/meeting.repository'
import { truncateToMinute } from '../utils/date.util'

export class MeetingService {
  constructor(private readonly meetingRepository: MeetingRepository) {}

  async createMeeting(request: MeetingCreateRequestDto): Promise<MeetingResponseDto> {
    const meeting = await this.meetingRepository.createWithCandidate({
      ...request,
      status: MeetingStatus.PENDING,
    })

    return this.mappingMeetingResponse(meeting)
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

    return this.mappingMeetingResponse(meeting)
  }

  async cancelMeeting(id: number): Promise<MeetingUpdateResponseDto> {
    const existing = await this.meetingRepository.findById(id)
    if (!existing) {
      throw new ApplicationError('Meeting Not Found')
    }

    const currentDate = truncateToMinute(new Date()).getTime()
    if (existing.status === MeetingStatus.CANCELED || currentDate > existing.endAt.getTime()) {
      throw new ApplicationError('Not Allow to Cancel This Meeting')
    }

    const meeting = await this.meetingRepository.update(id, { status: MeetingStatus.CANCELED })

    return {
      id: meeting.id,
      updatedAt: meeting.updatedAt,
    }
  }

  async feedback(id: number, feedback: string): Promise<MeetingUpdateResponseDto> {
    const existing = await this.meetingRepository.findById(id)
    if (!existing) {
      throw new ApplicationError('Meeting Not Found')
    }

    const currentDate = truncateToMinute(new Date()).getTime()
    if (existing.status === MeetingStatus.CANCELED || currentDate <= existing.endAt.getTime()) {
      throw new ApplicationError('Not Allow to Add Feedback')
    }

    const meeting = await this.meetingRepository.update(id, { feedback })

    return {
      id: meeting.id,
      updatedAt: meeting.updatedAt,
    }
  }

  async findMeetings(scope: string): Promise<MeetingResponseDto[]> {
    const currentDate = new Date()
    const statuses = [MeetingStatus.PENDING, MeetingStatus.CONFIRM]
    let params: MeetingsParams, orderBy: Prisma.MeetingOrderByWithRelationInput

    switch (scope) {
      case MeetingScope.UPCOMING: {
        params = { statuses, endAfter: currentDate }
        orderBy = { endAt: 'asc' }
        break
      }
      case MeetingScope.FINISHED: {
        params = { statuses, endBefore: currentDate }
        orderBy = { endAt: 'desc' }
        break
      }
      default: {
        throw new ApplicationError('Invalid Meeting Scope')
      }
    }

    const meetings = await this.meetingRepository.findManyWithCandidate(params, orderBy)
    return meetings.map(this.mappingMeetingResponse)
  }

  async findMeeting(id: number): Promise<MeetingResponseDto> {
    const existing = await this.meetingRepository.findByIdWithCandidate(id)

    if (!existing) {
      throw new ApplicationError('Meeting Not Found')
    }

    return this.mappingMeetingResponse(existing)
  }

  private mappingMeetingResponse(meeting: MeetingWithCandidate): MeetingResponseDto {
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
      feedback: meeting.feedback,
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    }
  }
}

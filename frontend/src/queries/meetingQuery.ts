import { meetingService } from '@/api/meetingService'
import type { MeetingScopeKey } from '@/constants/meetingScope'
import type { MeetingCreateRequestDto, MeetingUpdateRequestDto } from '@/interfaces/meetingRequest'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const PAGE_SIZE = 10

export const meetingQuery = {
  useGetMeetingsInfinite: (scope: MeetingScopeKey) =>
    useInfiniteQuery({
      queryKey: ['meetings', scope],
      queryFn: ({ pageParam, signal }) =>
        meetingService.getMeetings({ scope, cursor: pageParam }, signal),
      initialPageParam: null as number | null,
      getNextPageParam: (lastPage) =>
        lastPage.length === PAGE_SIZE ? lastPage[lastPage.length - 1].id : undefined,
    }),

  useCreateMeetingMutation: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (body: MeetingCreateRequestDto) => meetingService.createMeeting(body),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['meetings'] })
      },
    })
  },

  useUpdateMeetingMutation: (id: number) =>
    useMutation({
      mutationFn: (body: MeetingUpdateRequestDto) => meetingService.updateMeeting(id, body),
    }),

  useCancelMeetingMutation: () =>
    useMutation({
      mutationFn: (id: number) => meetingService.cancelMeeting(id),
    }),

  useFeedbackMutation: () =>
    useMutation({
      mutationFn: ({ id, feedback }: { id: number; feedback: string }) =>
        meetingService.feedback(id, feedback),
    }),
}

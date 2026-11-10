import { meetingService } from '@/api/meetingService'
import type { MeetingScopeKey } from '@/constants/meetingScope'
import { useInfiniteQuery } from '@tanstack/react-query'

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
}

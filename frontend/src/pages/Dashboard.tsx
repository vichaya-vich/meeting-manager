import { MeetingScope, type MeetingScopeKey } from '@/constants/meetingScope'
import { MeetingStatus } from '@/constants/meetingStatus'
import { PAGE } from '@/constants/pageUri'
import { Role } from '@/constants/role'
import { meetingQuery } from '@/queries/meetingQuery'
import { formatDateTimeDisplay } from '@/utils/dateUtil'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Fade,
  Grid,
  Link,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'

const Dashboard = () => {
  const observerRef = useRef<HTMLDivElement>(null)
  const [scope, setScope] = useState<MeetingScopeKey>('UPCOMING')

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    meetingQuery.useGetMeetingsInfinite(scope)

  const onChangeScope = (_event: React.MouseEvent, value: MeetingScopeKey) => {
    if (value !== null) {
      setScope(value)
    }
  }

  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    })

    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const meetings = data?.pages.flat() ?? []

  return (
    <Box
      sx={{
        padding: '20px',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <Grid container>
        <Grid size={8}>
          <Typography variant="h4">Upcoming Meetings</Typography>
        </Grid>
        <Grid size={4}>
          <ToggleButtonGroup
            color="primary"
            value={scope}
            exclusive
            aria-label="scope"
            sx={{ width: '100%', justifyContent: 'end' }}
            onChange={onChangeScope}
          >
            {Object.entries(MeetingScope).map(([key, value]) => (
              <ToggleButton key={key} value={key}>
                {value}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
      </Grid>

      <Box
        sx={{
          width: '100%',
          minHeight: 0,
          flex: 1,
          overflowY: 'auto',
          marginTop: '10px',
          padding: '16px',
          background: 'lightgrey',
          borderRadius: '25px',
        }}
      >
        <Stack spacing={2}>
          {meetings.map((data) => (
            <Card key={`meeting-${data.id}`}>
              <CardHeader
                title={
                  <Typography variant="h6">
                    {data.name} - {Role[data.role]}
                  </Typography>
                }
                disableTypography
              />
              <Divider variant="middle" />
              <CardContent>
                <Typography variant="body1">
                  <b>Date & Time :</b> {formatDateTimeDisplay(data.startAt, data.endAt)}
                </Typography>
                <Typography variant="body1">
                  <b>Status :</b> {MeetingStatus[data.status]}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Link
                  href={`${PAGE.CANDIDATE}/${data.candidateId}/${data.role.toLowerCase()}`}
                  variant="body2"
                  color="info"
                >
                  View Details
                </Link>
              </CardActions>
            </Card>
          ))}
          <Fade in={isFetching} unmountOnExit>
            <CircularProgress aria-label="Loading…" sx={{ alignSelf: 'center' }} />
          </Fade>
        </Stack>
        <Box ref={observerRef} sx={{ height: '1px' }} />
      </Box>
    </Box>
  )
}

export default Dashboard

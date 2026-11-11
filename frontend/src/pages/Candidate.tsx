import { MeetingStatus } from '@/constants/meetingStatus'
import { PAGE } from '@/constants/pageUri'
import { Role, type RoleKey } from '@/constants/role'
import { candidateQuery } from '@/queries/candidateQuery'
import { formatDateTimeDisplay } from '@/utils/dateUtil'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Fade,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Candidate = () => {
  const params = useParams()
  const navigate = useNavigate()
  const id = Number(params.id)
  const role = params.role?.toUpperCase() as RoleKey
  const invalidParam = isNaN(id) || !Object.keys(Role).includes(role.toUpperCase())

  const { data: candidate, isFetching, isError } = candidateQuery.useGetCandidate(id, role)

  useEffect(() => {
    if (invalidParam || isError) {
      navigate(PAGE.DEFAULT)
    }
  }, [invalidParam, isError, navigate])

  if (invalidParam || !candidate) return <></>

  const { upcomings = [], histories = [] } = candidate

  return (
    <Box
      sx={{
        padding: '20px',
        width: '100%',
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <Fade in={isFetching} unmountOnExit>
        <CircularProgress aria-label="Loading…" sx={{ alignSelf: 'center' }} />
      </Fade>

      {candidate && (
        <>
          <Typography variant="h4" sx={{ marginBottom: '10px' }}>
            {candidate.name} - {Role[candidate.role]}
          </Typography>

          <Typography variant="h6">Meeting Info :</Typography>
          {upcomings.length > 0 && (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                flexShrink: 0,
                overflowY: 'auto',
                marginTop: '10px',
                marginBottom: '10px',
                padding: '16px',
                background: 'lightgrey',
                borderRadius: '25px',
              }}
            >
              <Stack spacing={2}>
                {upcomings.map((data) => (
                  <Card key={`meeting-${data.id}`}>
                    <CardContent>
                      <Typography variant="body2">
                        <b>Date & Time :</b> {formatDateTimeDisplay(data.startAt, data.endAt)}
                      </Typography>
                      <Typography variant="body2">
                        <b>Status :</b> {MeetingStatus[data.status]}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Button variant="outlined" color="error">
                        Cancel Meeting
                      </Button>
                      <Button variant="contained">Edit Meeting</Button>
                    </CardActions>
                  </Card>
                ))}
              </Stack>
            </Box>
          )}

          <Typography variant="h6">History :</Typography>
          {histories.length > 0 && (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                flexShrink: 0,
                overflowY: 'auto',
                marginTop: '10px',
                padding: '16px',
                background: 'lightgrey',
                borderRadius: '25px',
              }}
            >
              <Stack spacing={2}>
                {histories.map((data) => (
                  <Card key={`meeting-${data.id}`}>
                    <CardContent>
                      <Typography variant="body2">
                        <b>Date & Time :</b> {formatDateTimeDisplay(data.startAt, data.endAt)}
                      </Typography>
                      <Typography variant="body2">
                        <b>Status :</b> {MeetingStatus[data.status]}
                      </Typography>
                      <Typography variant="body2">
                        <b>Feedback :</b> {data.feedback}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Button variant="contained">Add Feedback</Button>
                    </CardActions>
                  </Card>
                ))}
              </Stack>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default Candidate

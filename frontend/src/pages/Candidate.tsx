import AlertModal from '@/components/AlertModal'
import ConfirmModal from '@/components/ConfirmModal'
import { MeetingStatus } from '@/constants/meetingStatus'
import { PAGE } from '@/constants/pageUri'
import { Role, type RoleKey } from '@/constants/role'
import { candidateQuery } from '@/queries/candidateQuery'
import { meetingQuery } from '@/queries/meetingQuery'
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
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Candidate = () => {
  const params = useParams()
  const navigate = useNavigate()
  const id = Number(params.id)
  const role = params.role?.toUpperCase() as RoleKey
  const invalidParam = isNaN(id) || !Object.keys(Role).includes(role.toUpperCase())

  const [cancelId, setCancelId] = useState<number>()
  const [showAlert, setShowAlert] = useState(false)

  const { data: candidate, isFetching, isError, refetch } = candidateQuery.useGetCandidate(id, role)

  const mutation = meetingQuery.useCancelMeetingMutation()

  useEffect(() => {
    if (invalidParam || isError) {
      navigate(PAGE.DEFAULT)
    }
  }, [invalidParam, isError, navigate])

  if (invalidParam || !candidate) return <></>

  const onConfirmCancel = () => {
    if (cancelId !== undefined) {
      mutation.mutate(cancelId, {
        onSuccess: () => {
          setCancelId(undefined)
          setShowAlert(true)
          refetch()
        },
      })
    }
  }

  const { upcomings = [], histories = [] } = candidate

  return (
    <>
      <AlertModal
        message="Meeting is canceled."
        open={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <ConfirmModal
        open={cancelId !== undefined}
        onConfirm={onConfirmCancel}
        onCancel={() => setCancelId(undefined)}
      />
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
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => setCancelId(data.id)}
                        >
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
    </>
  )
}

export default Candidate

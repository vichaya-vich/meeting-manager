import Navbar from '@/containers/Navbar'
import AppRoutes from '@/routes/AppRoutes'
import { theme } from '@/theme/theme'
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <BrowserRouter>
            <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar />
              <Container component="main" sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
                <AppRoutes />
              </Container>
            </Box>
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

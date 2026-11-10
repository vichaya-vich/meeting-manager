import { createTheme } from '@mui/material'

export const theme = createTheme({
  shape: { borderRadius: 25 },
  palette: {
    primary: {
      main: '#fcb900',
    },
    secondary: {
      main: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'monospace',
    fontWeightMedium: '600',
    h4: { fontWeight: '600' },
  },
  components: {
    MuiCard: { defaultProps: { variant: 'outlined' } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
  },
})

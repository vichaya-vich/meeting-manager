import { createTheme } from '@mui/material'
import type {} from '@mui/x-date-pickers/themeAugmentation'

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
    MuiDatePicker: { defaultProps: { format: 'DD/MM/YYYY' } },
  },
})

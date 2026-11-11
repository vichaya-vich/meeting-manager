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
    MuiCardContent: { defaultProps: { style: { paddingBottom: 0 } } },
    MuiCardActions: { defaultProps: { style: { paddingTop: 0 } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
    MuiDatePicker: { defaultProps: { format: 'DD/MM/YYYY' } },
  },
})

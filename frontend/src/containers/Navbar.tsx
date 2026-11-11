import BookingModal from '@/containers/BookingModal'
import Logo from '@/components/Logo'
import { AppBar, Button, Toolbar } from '@mui/material'
import { useState } from 'react'

const Navbar = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <BookingModal open={open} onClose={() => setOpen(false)} />
      <AppBar position="static">
        <Toolbar>
          <Logo />
          <Button
            color="secondary"
            sx={{ ml: 'auto', fontSize: '18px' }}
            onClick={() => setOpen(true)}
          >
            Booking
          </Button>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Navbar

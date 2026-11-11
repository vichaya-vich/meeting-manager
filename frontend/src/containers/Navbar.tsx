import Logo from '@/components/Logo'
import { PAGE } from '@/constants/pageUri'
import BookingModal from '@/containers/BookingModal'
import { AppBar, Button, Link, Toolbar } from '@mui/material'
import { useState } from 'react'

const Navbar = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <BookingModal open={open} onClose={() => setOpen(false)} />
      <AppBar position="static">
        <Toolbar>
          <Link href={PAGE.DASHBOARD}>
            <Logo />
          </Link>

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

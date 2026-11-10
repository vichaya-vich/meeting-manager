import Logo from '@/components/Logo'
import { AppBar, Toolbar } from '@mui/material'

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Logo />
      </Toolbar>
    </AppBar>
  )
}

export default Navbar

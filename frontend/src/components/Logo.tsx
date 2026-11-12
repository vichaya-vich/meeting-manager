import { Avatar } from '@mui/material'
import logo from '../assets/eggdigital_logo.jpg'

const Logo = ({ size = 50 }) => {
  return <Avatar src={logo} alt="logo" sx={{ width: size, height: size }} />
}

export default Logo

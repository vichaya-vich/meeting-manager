import { Avatar } from '@mui/material'

const Logo = ({ size = 50 }) => {
  return (
    <Avatar src="/src/assets/eggdigital_logo.jpg" alt="logo" sx={{ width: size, height: size }} />
  )
}

export default Logo

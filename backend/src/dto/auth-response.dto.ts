export interface TokenResponseDto {
  accessToken: string
  refreshToken: string
}

export interface UserResponseDto {
  id: number
  email: string
  createdAt: Date
}

export interface AuthResponseDto extends TokenResponseDto {
  user: UserResponseDto
}

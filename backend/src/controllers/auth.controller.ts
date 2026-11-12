import { RequestHandler } from 'express'
import { LoginRequestDto, RefreshTokenRequestDto } from '../dto/auth-request.dto'
import { AuthService } from '../services/auth.service'

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login: RequestHandler<{}, {}, LoginRequestDto> = async (
    request,
    response,
    next,
  ): Promise<void> => {
    try {
      const result = await this.authService.login(request.body)
      response.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  refresh: RequestHandler<{}, {}, RefreshTokenRequestDto> = async (
    request,
    response,
    next,
  ): Promise<void> => {
    try {
      const result = await this.authService.refresh(request.body.refreshToken)
      response.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}

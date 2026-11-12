import { verify } from 'argon2'
import { LoginRequestDto } from '../dto/auth-request.dto'
import { AuthResponseDto, TokenResponseDto, UserResponseDto } from '../dto/auth-response.dto'
import { ApplicationError } from '../handlers/error.handler'
import { SessionRepository } from '../repositories/session.repository'
import { UserRepository } from '../repositories/user.repository'
import { newRefreshSecret, refreshExpiry, signAccessToken } from '../utils/auth.util'
import { sha256 } from '../utils/string.util'

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async login({ email, password }: LoginRequestDto): Promise<AuthResponseDto> {
    const existing = await this.userRepository.findByEmail(email)
    if (!existing?.password || !(await verify(existing.password, password))) {
      throw new ApplicationError('Invalid email or password')
    }

    const { password: _password, ...user } = existing
    return this.startSession(user)
  }

  async refresh(refreshToken: string): Promise<TokenResponseDto> {
    const [sessionId, secret] = refreshToken.split('.')
    const session = sessionId && secret ? await this.sessionRepository.findById(sessionId) : null
    if (!session || session.revokedAt || session.expiresAt <= new Date()) {
      throw new ApplicationError('Invalid Refresh Token')
    }

    const nextSecret = newRefreshSecret()
    const rotated = await this.sessionRepository.rotate(
      session.id,
      sha256(secret!),
      sha256(nextSecret),
      refreshExpiry(),
    )
    if (!rotated) {
      await this.sessionRepository.revoke(session.id)
      throw new ApplicationError('Invalid Refresh Token')
    }

    return {
      accessToken: await signAccessToken(session.userId, session.id),
      refreshToken: `${session.id}.${nextSecret}`,
    }
  }

  private async startSession(user: UserResponseDto): Promise<AuthResponseDto> {
    const secret = newRefreshSecret()
    const session = await this.sessionRepository.create({
      userId: user.id,
      refreshTokenHash: sha256(secret),
      expiresAt: refreshExpiry(),
    })
    return {
      user,
      accessToken: await signAccessToken(user.id, session.id),
      refreshToken: `${session.id}.${secret}`,
    }
  }
}

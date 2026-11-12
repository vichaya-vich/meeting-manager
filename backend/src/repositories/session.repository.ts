import { Prisma, PrismaClient } from '../generated/prisma/client'

export class SessionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findById(id: string) {
    return this.prisma.session.findUnique({ where: { id } })
  }

  create(data: Prisma.SessionUncheckedCreateInput) {
    return this.prisma.session.create({ data })
  }

  async rotate(id: string, currentHash: string, nextHash: string, expiresAt: Date) {
    const { count } = await this.prisma.session.updateMany({
      where: { id, refreshTokenHash: currentHash, revokedAt: null },
      data: { refreshTokenHash: nextHash, expiresAt },
    })
    return count === 1
  }

  async revoke(id: string) {
    await this.prisma.session.updateMany({
      where: { id, revokedAt: null },
      data: { revokedAt: new Date() },
    })
  }
}

import { PrismaClient } from '../generated/prisma/client'

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }
}

import { PrismaClient } from '@prisma/client'

// PrismaClient is instantiated once and reused throughout the application
// This prevents us from exhausting our database connection limit.

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma

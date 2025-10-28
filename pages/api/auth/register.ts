import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
// In a real app, you would use bcrypt or similar for password hashing
// import bcrypt from 'bcryptjs' 

// POST /api/auth/register - Register a new user
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { email, name, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' })
    }

    // Hash password (Skipped for simplicity in this initial implementation)
    // const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password, // WARNING: Storing plain password for simplicity. MUST HASH IN PRODUCTION.
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    })

    return res.status(201).json(newUser)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to register user' })
  }
}

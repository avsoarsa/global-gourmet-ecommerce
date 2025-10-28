import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
// In a real app, you would use bcrypt or similar for password hashing
// import bcrypt from 'bcryptjs' 

// POST /api/auth/login - Log in a user
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Compare password (Skipped for simplicity in this initial implementation)
    // const passwordMatch = await bcrypt.compare(password, user.password)
    const passwordMatch = user.password === password // Simple comparison for now

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // In a real app, you would issue a JWT or set a secure cookie here.
    return res.status(200).json({ 
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Login failed' })
  }
}

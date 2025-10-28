import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

// GET /api/products/[id] - Get a single product
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const productId = req.query.id as string

  if (req.method === 'GET') {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      })
      if (product) {
        return res.status(200).json(product)
      } else {
        return res.status(404).json({ error: 'Product not found' })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to fetch product' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

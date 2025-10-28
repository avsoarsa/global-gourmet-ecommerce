import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

// GET /api/products - Get all products
// POST /api/products - Create a new product (Admin only in a real app)
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const products = await prisma.product.findMany()
      return res.status(200).json(products)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to fetch products' })
    }
  } else if (req.method === 'POST') {
    // In a real application, this would require authentication and authorization checks
    const { name, description, price, imageUrl, category } = req.body
    
    // Basic validation
    if (!name || !price) {
        return res.status(400).json({ error: 'Missing required fields: name and price' })
    }

    try {
      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          imageUrl,
          category,
        },
      })
      return res.status(201).json(newProduct)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to create product' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../../utils/auth'
import prisma from '../../lib/prisma'

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const [, token] = authorization.split(' ')

  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const { uuid } = verifyToken(token)

    const user = await prisma.user.findUnique({
      where: {
        uuid,
      },
    })

    if (!user) return res.status(401).json({ message: 'Unauthorized' })

    req.user = user
    next()
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

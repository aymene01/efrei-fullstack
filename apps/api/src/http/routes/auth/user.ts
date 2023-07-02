import { Router } from 'express'
import prisma from '../../../lib/prisma'
import { hashPassword, comparePassword, generateToken } from '../../../utils/auth'

const api: Router = Router()

api.post('/register', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body

  console.log(req.body)

  if (password !== passwordConfirmation) {
    return res.status(400).json({
      message: 'Passwords do not match',
    })
  }

  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userExists) {
    return res.status(400).json({
      message: 'User already exists',
    })
  }

  const encryptedPassword = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      email,
      encryptedPassword,
    },
  })

  res.json(user)
})

api.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    return res.status(400).json({
      message: 'User not found',
    })
  }

  const passwordMatch = await comparePassword(password, user.encryptedPassword)

  if (!passwordMatch) {
    return res.status(400).json({
      message: 'Invalid password',
    })
  }

  const { uuid } = user

  const payload = {
    uuid,
    email,
  }

  const token = await generateToken(payload)

  res.json({ user, meta: { token } })
})

export default api

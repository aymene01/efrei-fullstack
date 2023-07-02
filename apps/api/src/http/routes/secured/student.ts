import { Router } from 'express'
import prisma from '@/lib/prisma'
import { isEmpty } from 'lodash'
import { hashPassword } from '../../../utils/auth'

const api: Router = Router()

api.get('/', async (req, res) => {
  const allStudents = await prisma.student.findMany()

  return res.json(allStudents)
})

api.get('/:id', async (req, res) => {
  const classe = prisma.class.findUnique({
    where: {
      uuid: req.params.id,
    },
  })

  if (!classe) return res.json({ message: 'the classe with the given id was not found' })

  res.json({ classe })
})

api.post('/', async (req, res) => {
  const { name, email, password, classUuid } = req.body

  const studentExist = await prisma.student.findFirst({
    where: {
      email,
    },
  })

  if (studentExist) return res.json({ message: 'A student with the given email already exist' })

  const student = await prisma.student.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
      classUuid: classUuid === '' ? '' : classUuid,
    },
  })

  res.json({ student })
})

api.delete('/:id', async (req, res) => {
  console.log(req.params.id)
  const studentToDelete = await prisma.student.findUnique({
    where: {
      uuid: req.params.id,
    },
  })

  if (!studentToDelete) return res.json({ message: "The student you are trying to delete does't exist" }).status(400)

  const student = await prisma.student.delete({
    where: {
      uuid: req.params.id,
    },
  })

  return res.json({ student })
})

export default api

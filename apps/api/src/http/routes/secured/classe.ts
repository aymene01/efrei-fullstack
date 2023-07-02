import { Router } from 'express'
import prisma from '@/lib/prisma'
import { isEmpty } from 'lodash'

const api: Router = Router()

api.get('/', async (req, res) => {
  const allClasses = await prisma.class.findMany()

  return res.json(allClasses)
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
  const { name, students } = req.body

  const classeExist = await prisma.class.findFirst({
    where: {
      name,
    },
  })

  if (classeExist) return res.json({ message: 'A classe with the given name already exist' })

  const classe = await prisma.class.create({
    data: {
      name,
      students: students && isEmpty(students) ? [] : students,
    },
  })

  res.json({ classe })
})

api.delete('/:id', async (req, res) => {
  const classeToDelete = await prisma.class.findUnique({
    where: {
      uuid: req.params.id,
    },
  })

  if (!classeToDelete) return res.json({ message: "The classe you are trying to delete does't exist" })

  const classe = await prisma.class.delete({
    where: {
      uuid: req.params.id,
    },
  })

  return res.json({ classe })
})

export default api

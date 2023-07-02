import { Router } from 'express'
import classe from './classe'
import student from './student'

const api: Router = Router()

api.get('/test', (req, res) => {
  res.json({ message: 'hello from secured route', user: req.user })
})

api.use('/classe', classe)
api.use('/student', student)

export default api

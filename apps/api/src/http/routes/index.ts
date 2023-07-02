import { Router } from 'express'
import auth from './auth'
import secured from './secured'
import { authenticate } from '../middlewares/authenticate'

const api: Router = Router()

api.get('/', (_, res) => {
  res.json({ message: 'Hello World!' })
})

api.use('/auth', auth)
api.use('/', authenticate, secured)

export default api

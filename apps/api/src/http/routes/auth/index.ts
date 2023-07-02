import { Router } from 'express'
import user from './user'

const api: Router = Router()

api.use('/user', user)

export default api

import type { User } from '@prisma/client'

export {}

type UserRequest = Pick<User, 'uuid'>

declare global {
  namespace Express {
    export interface Request {
      user: UserRequest
    }
  }
}

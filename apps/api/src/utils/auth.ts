import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import * as Env from '../bin/env'

type Payload = {
  uuid: string
  email: string
}

export const generateToken = (payload: Payload) => {
  return jwt.sign(payload, Env.JWT_SECRET)
}

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10)
}

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash)
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, Env.JWT_SECRET) as jwt.JwtPayload
}

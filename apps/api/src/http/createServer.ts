import express, { Application, Response, NextFunction } from 'express'
import * as http from 'http'
import { promisify } from 'util'
import { Options } from './types'
import cors from 'cors'
import morgan from 'morgan'
import router from './routes'

export type Server = {
  start(): Promise<void>
  stop(): Promise<void>
}

export const createServer = (opts: Options): Server => {
  const app: Application = express()

  app.set('etag', false)
  app.set('trust proxy', true)
  app.disable('x-powered-by')

  app.use((_, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type, Content-Length, Authorization')

    next()
  })

  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(morgan('dev'))
  app.use(opts.mouthPath, router)

  app.get('/health', (_, res: Response) => {
    res.json({ message: 'ok' }).status(200)
  })

  const httpServer = http.createServer(app)
  httpServer.keepAliveTimeout = opts.keepAliveTimeout

  return {
    start: async () => {
      const { host, port } = opts.listenAddr
      await new Promise<void>(resolve => httpServer.listen({ port }, resolve))
      console.log(`🚀 Server ready at http://${host}:${port}${opts.mouthPath}`)
    },
    stop: async () => {
      await promisify(httpServer.close).bind(httpServer)()
    },
  }
}

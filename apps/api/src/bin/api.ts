import { createServer } from '../http/createServer'
import { waitForSignal } from '@my-efrei/toolbox'
import * as Env from './env'

const api = async () => {
  const server = createServer({
    keepAliveTimeout: Env.GRAPHQL_KEEP_ALIVE_TIMEOUT,
    listenAddr: Env.LISTEN_ADDR,
    mouthPath: Env.GRAPHQL_MOUNT_PATH,
  })

  await server.start()
  await waitForSignal(['SIGINT', 'SIGTERM'])
  await server.stop()
}

api().catch(err => {
  console.error(err)
})

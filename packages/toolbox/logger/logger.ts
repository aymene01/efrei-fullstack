import pino, { Logger as LoggerType } from 'pino'

export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

export type Logger = LoggerType

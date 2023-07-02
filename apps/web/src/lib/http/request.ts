import { IncomingHttpHeaders } from 'http'
import { isString } from 'lodash'
import getConfig from 'next/config'

type HTTPVerb = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS'

export type FetchOptions = {
  method: HTTPVerb
  headers?: IncomingHttpHeaders
}

export type SafeFetchOptions = FetchOptions & {
  body?: unknown
}

type FetchArgs = {
  apiBaseUrl?: string
  resources?: string | string[]
  options?: SafeFetchOptions
}

type FormatedFetchOptions = FetchOptions & {
  body: string
}

type FetchResponse = {
  json: () => Promise<any>
}

const API_BASE_URL = 'http://localhost:8080/api/v1'

const safeFetch = ({ resources, apiBaseUrl = API_BASE_URL, options = { method: 'GET' } }: FetchArgs): Promise<any> => {
  const { publicRuntimeConfig } = getConfig()
  const jswt = localStorage.getItem('token')

  console.log(jswt)

  const headers: Record<string, any> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...options,
  }

  if (jswt) {
    headers.authorization = `Bearer ${jswt}`
  }

  const formattedOptions: FormatedFetchOptions = {
    ...options,
    headers,
    body: isString(options.body) ? options.body : JSON.stringify(options.body),
  }

  const url = apiBaseUrl + '/' + resources

  return fetch(url, formattedOptions as any)
}

export const fetcher = async (args: FetchArgs): Promise<any> => {
  const response = await safeFetch(args)

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const data = await response.json()

  return data
}

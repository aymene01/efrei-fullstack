import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastProvider } from '@/core/providers/toast'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { UserProvider } from '../core/providers/user'

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <UserProvider>
          <ToastProvider>
            <Component {...pageProps} />
          </ToastProvider>
        </UserProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

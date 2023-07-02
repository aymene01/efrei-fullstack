import LoginForm from '@/core/components/LoginForm'
import { fetcher } from '@/lib/http/request'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'

const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 flex-col space-y-4">
      <LoginForm />
      <p>
        You don't have an account?{' '}
        <Link className="text-blue-500 hover:underline" href="/auth/register">
          create account
        </Link>
      </p>
    </div>
  )
}

export default Login

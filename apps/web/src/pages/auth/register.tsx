import { VStack } from '@chakra-ui/react'
import React from 'react'
import RegisterForm from '@/core/components/RegisterForm'
import Link from 'next/link'

const Register = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 flex-col space-y-4">
      <VStack spacing={8}>
        <RegisterForm />
      </VStack>
      <p>
        You already have an account?{' '}
        <Link className="text-blue-500 hover:underline" href="/auth/login">
          login
        </Link>
      </p>
    </div>
  )
}

export default Register

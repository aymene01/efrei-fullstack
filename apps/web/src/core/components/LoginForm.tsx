import React from 'react'
import { Box, Button, FormControl, FormLabel, Heading, Input, Stack } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useUser } from '../providers/user'
import { useMutation } from '@tanstack/react-query'
import { fetcher } from '@/lib/http/request'
import { toast } from 'react-hot-toast'

type LoginForm = {
  email: string
  password: string
}


function LoginForm() {
  const { register, handleSubmit } = useForm<LoginForm>()

  const { mutate } = useMutation({
    mutationFn: async (data: LoginForm) => fetcher({
      resources: "auth/user/login", options: {
        method: "POST",
        body: {
          email: data.email,
          password: data.password
        }
      }
    }),
    onSuccess: (data: any) => {
      const { user, meta: { token } } = data
      login({ user }, token)
    },
    onError: () => {
      toast.error('Invalid credentials')
    }
  })

  const { login } = useUser()

  const onSubmit = ({ email, password }: LoginForm) => {
    mutate({
      email,
      password
    })
  }

  return (
    <Box w="400px" p={6} bg="white" shadow="md" rounded="md">
      <Heading mb={4}>Login</Heading>
      <form>
        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input {...register('email')} type="email" required />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input {...register('password')} type="password" required />
          </FormControl>
          <Button colorScheme="blue" type="submit" onClick={handleSubmit(onSubmit)}>
            Login
          </Button>
        </Stack>
      </form>
    </Box>
  )
}

export default LoginForm

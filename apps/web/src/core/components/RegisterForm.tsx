import React from 'react'
import { Box, Button, FormControl, FormLabel, Heading, Input, Stack } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { fetcher } from '@/lib/http/request'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'

type RegisterFormInputs = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

function RegisterForm() {
  const { register, handleSubmit } = useForm<RegisterFormInputs>()
  const { push } = useRouter()

  const { mutate } = useMutation({
    mutationFn: async ({ email, name, password, passwordConfirmation }: RegisterFormInputs) => fetcher({
      resources: "auth/user/register", options: {
        method: "POST",
        body: {
          name,
          email,
          password,
          passwordConfirmation
        }
      }
    }),
    onSuccess: () => {
      toast.success("Account created")
      push('/auth/login')
    },
    onError: () => {
      toast.error('Something went wrong')
    }
  })

  const onSubmit = ({ email, name, password, passwordConfirmation }: RegisterFormInputs) => {
    mutate({
      email,
      name,
      password,
      passwordConfirmation
    })
  }
  return (
    <Box w="400px" p={4} bg="white" shadow="md" rounded="md">
      <Heading mb={4}>Register</Heading>
      <form>
        <Stack spacing={4}>
          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <Input {...register('name')} type="text" required />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input {...register('email')} type="email" required />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input {...register('password')} type="password" required />
          </FormControl>
          <FormControl>
            <FormLabel>Password Confirmation</FormLabel>
            <Input {...register('passwordConfirmation')} type="password" required />
          </FormControl>
          <Button onClick={handleSubmit(onSubmit)} colorScheme="blue" type="submit">
            Register
          </Button>
        </Stack>
      </form>
    </Box>
  )
}

export default RegisterForm

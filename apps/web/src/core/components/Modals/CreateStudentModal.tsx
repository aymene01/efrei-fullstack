import * as React from 'react'
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/http/request';
import { Input, Select } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

type CreateStudent = {
  name: string
  email: string
  password: string
  classUuid: string
}

export const CreateStudentModal = ({ isOpen, setIsOpen }) => {
  const queryClient = useQueryClient()
  const { register, handleSubmit } = useForm()

  const { mutate } = useMutation({
    mutationFn: async ({ name, classUuid, email, password }: CreateStudent) => fetcher({
      resources: "student", options: {
        method: "POST", body: {
          name,
          classUuid,
          email,
          password
        }
      }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['allStudents'])
      setIsOpen(false)
    }
  })

  const { data: classes } = useQuery({ queryFn: async () => fetcher({ resources: "classe" }) })

  React.useEffect(() => {
    if (classes) {
      console.log(classes)
    }
  })

  const onSubmit = ({ classUuid, email, name, password }: CreateStudent) => {
    mutate({
      classUuid,
      email,
      name,
      password
    })
  }

  const canCreateStudent = classes?.length === 0

  return (
    <div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create a new Student !
                  </Dialog.Title>
                  <div className="mt-2 space-y-2">
                    <Input placeholder='name' {...register('name')} />
                    <Input placeholder='email' {...register('email')} />
                    <Input placeholder='password' {...register('password')} />
                    {
                      classes?.length !== 0 ? <Select placeholder='Select option' {...register('classUuid')}>
                        {
                          classes && classes.map(classe => (<option value={classe.uuid}>{classe.name}</option>))
                        }
                      </Select> : <p className='mt-5'>You have create a classe before creating a student</p>
                    }
                  </div>

                  <div className="mt-4">
                    {
                      !canCreateStudent && <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={handleSubmit(onSubmit)}
                        disabled={canCreateStudent}
                      >
                        Create
                      </button>
                    }

                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}


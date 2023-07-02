import { Toaster } from 'react-hot-toast'

type ToastProviderProps = {
  children: React.ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-white text-stone-800 dark:bg-black dark:text-stone-200',
        }}
      />
      {children}
    </>
  )
}

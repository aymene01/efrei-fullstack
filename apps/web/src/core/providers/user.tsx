import React from 'react'
import { isEmpty, omit } from 'lodash'
import { useRouter } from 'next/router'
import useAsync from '../hooks/useAsync'


type ContextProps = {
  state: State
  isReady: boolean
  dispatch: React.Dispatch<Action>
}

const UserContext = React.createContext<ContextProps | null>(null)

type User = {
  uuid: string
  email: string
  name: string
}

type State = Partial<User> & {
  isAuth: boolean
}

type Action = {
  type: 'LOGIN' | 'LOGOUT' | 'UPDATE'
  payload?: Partial<State>
  token?: string
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('token', action.token)
      localStorage.setItem('user', JSON.stringify(action.payload))
      return { ...state, ...action.payload, isAuth: true }
    case 'LOGOUT':
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return { ...state, isAuth: false }
    case 'UPDATE':
      const updates = {
        ...state,
        ...omit(action.payload, 'isAuth'),
      }
      if (!isEmpty(updates)) {
        localStorage.setItem('user', JSON.stringify(updates))
      }

      return {
        ...state,
        ...action.payload,
      }
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

type UserProviderProps = {
  children: React.ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [state, dispatch] = React.useReducer(reducer, null)
  const [isReady, setIsReady] = React.useState<boolean>(false)
  const { run, isIdle, isLoading } = useAsync()


  const { push, pathname } = useRouter()

  const values = React.useMemo(
    () => ({
      state,
      dispatch,
      isReady,
    }),
    [state, isReady],
  )

  const unauthenticatedRoutes = ['/auth/login', '/auth/register']
  const currentRoute = pathname

  const getMe = async () => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))

    if (token && user) {
      dispatch({ type: 'UPDATE', payload: { ...user, isAuth: true } })
    } else {
      dispatch({ type: 'UPDATE', payload: { isAuth: false } })
    }

  }

  const handleRoutes = async () => {
    if (state.isAuth && unauthenticatedRoutes.includes(currentRoute)) {
      push('/app')
    } else if (!state.isAuth && !unauthenticatedRoutes.includes(currentRoute)) {
      push('/auth/login')
    }
  }

  React.useEffect(() => {
    run(getMe())
  }, [])

  React.useEffect(() => {
    if (state) {
      run(handleRoutes())
    }
  }, [state])

  React.useEffect(() => {
    if (!isIdle && !isLoading) {
      setIsReady(true)
    }
  }, [isIdle, isLoading])

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>
}

type Payload = {
  user: {
    email: string
    uuid: string
  }
}

export const useUser = () => {
  const context = React.useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  const { dispatch } = context

  const login = (payload: Payload, token: string) => {
    const { email, uuid } = payload.user
    dispatch({ type: 'LOGIN', payload: { uuid, email }, token })
  }

  const logout = () => dispatch({ type: 'LOGOUT' })

  return {
    ...context,
    login,
    logout,
  }
}

import * as React from 'react'

type Status = 'idle' | 'pending' | 'resolved' | 'rejected'

type State<T> = {
  status: Status
  data: T | null
  error: Error | null
}


const useSafeDispatch = dispatch => {
  const mountedRef = React.useRef(false)

  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return React.useCallback(
    (...args) => {
      if (mountedRef.current) {
        dispatch(...args)
      }
    },
    [dispatch],
  )
}

/**
 * @description a hook for using async calls with ease
 **/
export const useAsync = <T,>(initialState: State<T> = { status: 'idle', data: null, error: null }) => {
  const initialStateRef = React.useRef(initialState)

  const [{ status, data, error }, unsafeSetState] = React.useReducer(
    (state: State<T>, action: Partial<State<T>>) => ({ ...state, ...action }),
    initialStateRef.current,
  )

  const setState = useSafeDispatch(unsafeSetState)

  const setData = React.useCallback((data: T) => setState({ data, status: 'resolved' }), [setState])
  const setError = React.useCallback((error: Error) => setState({ error, status: 'rejected' }), [setState])
  const reset = React.useCallback(() => setState(initialStateRef.current), [setState])

  const run = React.useCallback(
    (promise: Promise<T>) => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`,
        )
      }
      setState({ status: 'pending' })
      return promise.then(
        (data: T) => {
          setData(data)
          return data
        },
        (error: Error) => {
          setError(error)
          return Promise.reject(error)
        },
      )
    },
    [setData, setError, setState],
  )

  return {
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  }
}

export default useAsync

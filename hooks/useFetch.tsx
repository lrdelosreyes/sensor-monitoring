import { useEffect, useState } from 'react'

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'

const SENSOR_API = process.env.NEXT_PUBLIC_SENSOR_API_URL

const useFetch = (
  path: string,   
  method: Method = 'GET',
  body?: any
) => {
  const [isPending, setIsPending] = useState(false)
  const [data, setData] = useState<any>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    async () => {
      setIsPending(true)

      await fetch(`${SENSOR_API}/${path}`, {
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
        .then((res: any) => {
          setData(res)
        })
        .catch(() => {
          setHasError(true)
          setIsPending(false)
        })
        .finally(() => setIsPending(false))
    }
  }, [path, body, method])

  return {
    isPending,
    data,
    hasError
  }
}

export default useFetch
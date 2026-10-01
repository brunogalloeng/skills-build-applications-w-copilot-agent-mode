import { useEffect, useState } from 'react'

export default function useApiData(loader, deps = []) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true
    loader()
      .then((result) => active && setData(result))
      .catch((err) => active && setError(err.message))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version])

  return { data, error, reload: () => setVersion((v) => v + 1) }
}

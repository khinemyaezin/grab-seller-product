
import { debounce } from "lodash"
import { useCallback, useEffect, useRef } from "react"

export function useDebounce<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number
) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const debounceFn = useCallback(
    debounce((...args: Parameters<T>) => {
        callbackRef.current(...args)
    }, delay), []);

  return { debounceFn } as const
}

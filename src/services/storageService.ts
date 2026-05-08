type Listener = () => void

const listeners = new Set<Listener>()

export const emitStorageChange = () => {
  listeners.forEach((listener) => listener())
}

export const subscribeStorage = (listener: Listener) => {
  listeners.add(listener)

  const handleStorage = () => listener()
  window.addEventListener("storage", handleStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", handleStorage)
  }
}

export const readStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback

  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export const writeStorage = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value))
  emitStorageChange()
}

export const removeStorage = (key: string) => {
  localStorage.removeItem(key)
  emitStorageChange()
}

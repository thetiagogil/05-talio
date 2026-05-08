import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { useCurrentUser } from "../services/authService"
import { useEnsureWorkspaceSeed } from "../services/testDataService"

export function IndexRedirect() {
  useEnsureWorkspaceSeed()

  const user = useCurrentUser()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => setReady(true), 700)
    return () => window.clearTimeout(timeout)
  }, [])

  if (!ready) return <SplashScreen />
  if (!user) return <Navigate replace to="/login" />
  if (!user.role || !user.avatar) return <Navigate replace to="/setup" />

  return <Navigate replace to="/personal" />
}

function SplashScreen() {
  return (
    <main className="splash-screen">
      <div>
        <span>
          <strong>T</strong>
        </span>
        <h1>Talents</h1>
        <p>Loading your workspace...</p>
      </div>
    </main>
  )
}

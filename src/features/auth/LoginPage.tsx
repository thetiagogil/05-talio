import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, Button, Form, Input } from "antd"
import { ArrowRightOutlined, StarOutlined } from "@ant-design/icons"
import {
  loginAsTestUser,
  loginByEmail,
  useCurrentUser,
  useEnsureSeed,
} from "../../lib/talentsStore"
import type { User } from "../../types/talents"

export function LoginPage() {
  useEnsureSeed()

  const user = useCurrentUser()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) navigate(nextRoute(user), { replace: true })
  }, [navigate, user])

  function handleEmailLogin(values: { email: string }) {
    setError(null)

    const nextUser = loginByEmail(values.email)

    if (!nextUser) {
      setError("We couldn't find that email. Try the test user below.")
      return
    }

    navigate(nextRoute(nextUser), { replace: true })
  }

  function handleTestLogin() {
    const nextUser = loginAsTestUser()
    navigate(nextRoute(nextUser), { replace: true })
  }

  return (
    <main className="login-page">
      <aside className="login-hero">
        <div className="login-brand">
          <span>T</span>
          <strong>Talents</strong>
        </div>

        <section className="login-hero-copy">
          <p className="login-pill">
            <StarOutlined />
            Built for people-first teams
          </p>
          <h1>
            Know your strengths.
            <br />
            Grow with your team.
          </h1>
          <p>
            Discover what makes you tick, share how you work best, and find
            common ground with the people around you.
          </p>
          <div className="login-domains">
            <span>Executing</span>
            <span>Influencing</span>
            <span>Relationships</span>
            <span>Strategy</span>
          </div>
        </section>

        <p className="login-footer">&copy; Talents &middot; Internal team app</p>
      </aside>

      <section className="login-panel">
        <div className="login-form-wrap">
          <h2>Welcome back</h2>
          <p>Sign in with your work email to continue.</p>

          <Form
            className="login-form"
            layout="vertical"
            requiredMark={false}
            onFinish={handleEmailLogin}
          >
            <Form.Item
              label="Work email"
              name="email"
              rules={[
                { required: true, message: "Enter your work email." },
                { type: "email", message: "Enter a valid email address." },
              ]}
            >
              <Input size="large" placeholder="you@talents.app" />
            </Form.Item>

            {error && (
              <Alert
                className="login-error"
                message={error}
                showIcon
                type="error"
              />
            )}

            <Button
              block
              htmlType="submit"
              size="large"
              type="primary"
            >
              Continue <ArrowRightOutlined />
            </Button>
          </Form>

          <div className="login-divider">
            <span />
            or
            <span />
          </div>

          <Button block size="large" className="test-user-button" onClick={handleTestLogin}>
            Continue with test user
          </Button>

          <p className="login-tip">
            Tip: try <code>sofia@talents.app</code>,{" "}
            <code>marcus@talents.app</code>, or any seeded teammate.
          </p>
        </div>
      </section>
    </main>
  )
}

function nextRoute(user: User) {
  return user.role && user.avatar ? "/personal" : "/setup"
}

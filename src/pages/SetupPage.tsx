import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Steps } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { AVATAR_OPTIONS, DEFAULT_AVATAR } from "../data/avatars";
import { ROLES } from "../lib/constants/talentConstants";
import { useCurrentUser } from "../services/authService";
import { updateUser } from "../services/workspaceService";
import type { RoleName } from "../types/talents";

export function SetupPage() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<RoleName | null>(user?.role ?? null);
  const [avatar, setAvatar] = useState<string | null>(user?.avatar ?? null);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role && user.avatar)
      navigate("/personal/profile", { replace: true });
  }, [navigate, user]);

  if (!user) return null;

  const currentUser = user;

  function submit() {
    if (!role || !avatar) return;

    updateUser(currentUser.id, { role, avatar });
    navigate("/personal/profile", { replace: true });
  }

  return (
    <main className="setup-page">
      <div className="setup-wrap">
        <Steps
          className="setup-steps"
          current={step}
          items={[{ title: "" }, { title: "" }]}
          responsive={false}
          size="small"
        />

        <section className="setup-heading">
          <p>Step {step + 1} of 2</p>
          <h1>{step === 0 ? "What's your role?" : "Pick your avatar"}</h1>
          <span>
            {step === 0
              ? "This helps your teammates know what you do."
              : "Choose something that feels like you."}
          </span>
        </section>

        <section className="setup-content">
          {step === 0 ? (
            <div className="role-grid">
              {ROLES.map((option) => {
                const active = role === option;

                return (
                  <button
                    className={active ? "role-card active" : "role-card"}
                    key={option}
                    type="button"
                    onClick={() => setRole(option)}
                  >
                    <span>{option[0]}</span>
                    <strong>{option}</strong>
                    {active && <CheckOutlined />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="avatar-step">
              <div
                className={avatar ? "avatar-preview" : "avatar-preview muted"}
              >
                {avatar ?? DEFAULT_AVATAR}
              </div>
              <div className="avatar-grid">
                {AVATAR_OPTIONS.map((option) => {
                  const active = avatar === option;

                  return (
                    <button
                      className={
                        active ? "avatar-option active" : "avatar-option"
                      }
                      key={option}
                      type="button"
                      onClick={() => setAvatar(option)}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <footer className="setup-footer">
          <Button
            disabled={step === 0}
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={() => setStep(0)}
          >
            Back
          </Button>

          {step === 0 ? (
            <Button
              disabled={!role}
              size="large"
              type="primary"
              onClick={() => setStep(1)}
            >
              Next <ArrowRightOutlined />
            </Button>
          ) : (
            <Button
              disabled={!avatar}
              size="large"
              type="primary"
              onClick={submit}
            >
              Finish setup <CheckOutlined />
            </Button>
          )}
        </footer>
      </div>
    </main>
  );
}

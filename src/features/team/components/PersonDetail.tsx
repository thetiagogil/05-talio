import { useMemo, useState } from "react";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import { Box, Button, Card, Tab, Tabs, Typography } from "@mui/material";
import { AvatarBubble } from "@/features/users/components/AvatarBubble";
import { TalentRow } from "@/features/talents/components/TalentRow";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { useTalents } from "@/features/talents/hooks/useTalents";
import type { Talent, User } from "@/types/talents";
import { ManualEditor } from "@/features/personal/components/ManualEditor";
import { KudosButton } from "@/features/kudos/components/KudosButton";
import { EmptyState } from "@/shared/components/ui/EmptyState";

type PersonDetailProps = {
  user: User;
  onBack: () => void;
};

type PersonTab = "profile" | "manual";

export const PersonDetail = ({ user, onBack }: PersonDetailProps) => {
  const currentUser = useCurrentUser();
  const talents = useTalents();
  const [tab, setTab] = useState<PersonTab>("profile");
  const userTalents = useMemo(
    () =>
      user.talents
        .map((id) => talents.find((talent) => talent.id === id))
        .filter((talent): talent is Talent => Boolean(talent)),
    [talents, user.talents],
  );
  const hasManual = Object.values(user.manual).some((value) => value.trim());

  return (
    <Box sx={{ display: "grid", gap: "1.5rem" }}>
      <Button
        startIcon={<ArrowBackRounded />}
        variant="text"
        onClick={onBack}
        sx={{ justifySelf: "start", width: "auto" }}
      >
        Back to team
      </Button>

      <Card sx={{ overflow: "hidden", boxShadow: "none" }}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            gap: "1.25rem",
            overflow: "hidden",
            borderBottom: "1px solid var(--border)",
            p: "2rem",
            color: "var(--foreground)",
            bgcolor: "var(--surface)",
            background:
              "linear-gradient(135deg, var(--surface) 0, var(--accent) 56%, color-mix(in srgb, var(--domain-strategic-soft) 55%, var(--surface)) 100%)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <AvatarBubble value={user.avatar} size={80} />
            <Box component="span">
              <Typography
                sx={{
                  color: "var(--muted-foreground)",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {user.role ?? "Team member"}
              </Typography>
              <Typography
                component="h2"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  mt: "0.5rem",
                  fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
                  fontSize: "clamp(2.2rem, 5vw, 3rem)",
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                {user.name}
                {user.id === currentUser?.id && (
                  <Box
                    component="em"
                    sx={{
                      borderRadius: 999,
                      px: "0.4rem",
                      py: "0.1rem",
                      color: "var(--primary)",
                      bgcolor:
                        "color-mix(in oklch, var(--primary) 15%, transparent)",
                      fontSize: "0.625rem",
                      fontStyle: "normal",
                      fontWeight: 800,
                    }}
                  >
                    me
                  </Box>
                )}
              </Typography>
            </Box>
          </Box>
          {user.id !== currentUser?.id && <KudosButton to={user} />}
        </Box>

        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value as PersonTab)}
          sx={{
            borderBottom: "1px solid var(--border)",
            px: "1.5rem",
            "& .MuiTabs-indicator": { bgcolor: "var(--primary)" },
          }}
        >
          <Tab label="Profile" value="profile" />
          <Tab
            disabled={!hasManual}
            label={
              hasManual ? (
                "Manual of me"
              ) : (
                <Box component="span">
                  Manual of me{" "}
                  <Box
                    component="small"
                    sx={{
                      ml: "0.4rem",
                      borderRadius: 999,
                      px: "0.35rem",
                      py: "0.1rem",
                      bgcolor: "var(--muted)",
                      fontSize: "0.6rem",
                    }}
                  >
                    Empty
                  </Box>
                </Box>
              )
            }
            value="manual"
          />
        </Tabs>

        <Box sx={{ p: "1.5rem" }}>
          {tab === "profile" ? (
            userTalents.length === 0 ? (
              <EmptyState description="No talents have been added to this profile yet." />
            ) : (
              <Box sx={{ display: "grid", gap: "0.5rem" }}>
                {userTalents.map((talent, index) => (
                  <TalentRow key={talent.id} rank={index + 1} talent={talent} />
                ))}
              </Box>
            )
          ) : (
            <ManualEditor readOnly manual={user.manual} />
          )}
        </Box>
      </Card>
    </Box>
  );
};

import {
  AccessTimeRounded,
  EditRounded,
  EmojiEventsRounded,
  FavoriteBorderRounded,
  TrackChangesRounded,
} from "@mui/icons-material";
import { Box, Card, LinearProgress, Typography } from "@mui/material";
import { useMemo, useState, type ReactNode } from "react";
import { DOMAINS } from "@/features/talents/constants";
import { domainStyle } from "@/shared/utils/style-utils";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { useGoals } from "@/features/goals/hooks/useGoals";
import { useKudos } from "@/features/kudos/hooks/useKudos";
import { useTalents } from "@/features/talents/hooks/useTalents";
import type { Talent } from "@/types/talents";
import { AvatarBubble } from "@/features/users/components/AvatarBubble";
import { TalentRow } from "@/features/talents/components/TalentRow";
import { EditProfileModal } from "@/features/users/components/EditProfileModal";

export function ProfileTab() {
  const user = useCurrentUser();
  const talents = useTalents();
  const goals = useGoals();
  const kudos = useKudos();
  const [editing, setEditing] = useState(false);

  const userTalents = useMemo(
    () =>
      (user?.talents ?? [])
        .map((id) => talents.find((talent) => talent.id === id))
        .filter((talent): talent is Talent => Boolean(talent)),
    [talents, user?.talents],
  );

  if (!user) return null;

  const myGoals = goals.filter((goal) => goal.userId === user.id);
  const myKudos = kudos.filter((item) => item.toId === user.id);
  const todoGoals = myGoals.filter((goal) => goal.progress === "To do");
  const activeGoals = myGoals.filter((goal) => goal.progress === "Doing");
  const dominantDomain = DOMAINS.map((domain) => ({
    domain,
    count: userTalents.filter((talent) => talent?.category === domain).length,
  })).sort((a, b) => b.count - a.count)[0]?.domain;

  return (
    <Box
      sx={{
        display: "grid",
        width: "min(100%, 72rem)",
        mx: "auto",
        gap: "2.5rem",
      }}
    >
      <Box
        component="section"
        sx={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "auto 1fr auto" },
          alignItems: "center",
          gap: "2rem",
          overflow: "hidden",
          border: "1px solid var(--border)",
          borderRadius: "1rem",
          p: { xs: "2rem 1.25rem", sm: "2rem" },
          color: "var(--foreground)",
          bgcolor: "var(--surface)",
          background:
            "linear-gradient(135deg, var(--surface) 0, var(--accent) 56%, color-mix(in srgb, var(--domain-strategic-soft) 55%, var(--surface)) 100%)",
          textAlign: { xs: "center", md: "left" },
        }}
      >
        <Box
          component="button"
          aria-label="Change avatar"
          type="button"
          onClick={() => setEditing(true)}
          sx={{
            position: "relative",
            justifySelf: { xs: "center", md: "auto" },
            border: 0,
            bgcolor: "transparent",
            cursor: "pointer",
            p: 0,
          }}
        >
          <AvatarBubble value={user.avatar} size={128} />
          <Box
            component="span"
            sx={{
              position: "absolute",
              right: 0,
              bottom: 0,
              display: "grid",
              width: "2rem",
              height: "2rem",
              placeItems: "center",
              border: "1px solid var(--border)",
              borderRadius: 999,
              color: "var(--foreground)",
              bgcolor: "var(--surface)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <EditRounded fontSize="small" />
          </Box>
        </Box>

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            sx={{
              color: "var(--muted-foreground)",
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {user.role}
          </Typography>
          <Typography
            component="h2"
            sx={{
              mt: "0.5rem",
              fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
              fontSize: "clamp(2.2rem, 5vw, 3rem)",
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            {user.name}
          </Typography>
          <Typography
            component="span"
            sx={{
              display: "block",
              maxWidth: "28rem",
              mt: "0.75rem",
              color: "var(--muted-foreground)",
              lineHeight: 1.6,
            }}
          >
            You lead with{" "}
            <Box component="strong" sx={{ fontStyle: "italic" }}>
              {userTalents[0]?.label}
            </Box>
            {dominantDomain && (
              <>
                {" "}
                and most of your strengths fall under{" "}
                <strong>{dominantDomain}</strong>.
              </>
            )}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            width: { xs: "100%", md: "auto" },
            gap: "0.75rem",
            justifyContent: "flex-end",
            textAlign: "center",
          }}
        >
          <ProfileStat value={myKudos.length} label="kudos" />
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "18.75rem 1fr" },
          alignItems: "start",
          gap: "2rem",
        }}
      >
        <Box
          component="aside"
          sx={{
            display: "grid",
            alignContent: "start",
            alignSelf: "start",
            gap: "1.5rem",
          }}
        >
          <Card sx={{ p: "1.5rem", boxShadow: "none" }}>
            <PanelEyebrow>Domain breakdown</PanelEyebrow>
            <Box sx={{ display: "grid", gap: "1rem", mt: "1.25rem" }}>
              {DOMAINS.map((domain) => {
                const count = userTalents.filter(
                  (talent) => talent?.category === domain,
                ).length;
                const percent = (count / Math.max(userTalents.length, 1)) * 100;
                const style = domainStyle(domain);

                return (
                  <Box key={domain}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: "0.45rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontWeight: 600,
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: "0.625rem",
                            height: "0.625rem",
                            flex: "none",
                            borderRadius: 999,
                            bgcolor: style.base,
                          }}
                        />
                        {domain}
                      </Box>
                      <Typography
                        component="small"
                        sx={{
                          color: "var(--muted-foreground)",
                          fontFamily: "JetBrains Mono, ui-monospace, monospace",
                          fontSize: "0.75rem",
                        }}
                      >
                        {count}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percent}
                      sx={{
                        height: 8,
                        borderRadius: 999,
                        bgcolor: "var(--muted)",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: style.base,
                          borderRadius: 999,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Card>

          <Card sx={{ p: "1.5rem", boxShadow: "none" }}>
            <PanelEyebrow>At a glance</PanelEyebrow>
            <Box sx={{ display: "grid", gap: "0.75rem", mt: "1rem" }}>
              <AtGlanceRow
                icon={<TrackChangesRounded />}
                label="To do tasks"
                value={todoGoals.length}
              />
              <AtGlanceRow
                icon={<AccessTimeRounded />}
                label="In progress tasks"
                value={activeGoals.length}
              />
              <AtGlanceRow
                icon={<EmojiEventsRounded />}
                label="Completed tasks"
                value={
                  myGoals.filter((goal) => goal.progress === "Done").length
                }
              />
              <AtGlanceRow
                icon={<FavoriteBorderRounded />}
                label="Kudos received"
                value={myKudos.length}
              />
            </Box>
          </Card>
        </Box>

        <Box component="section">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: "1rem",
            }}
          >
            <Typography
              component="h2"
              sx={{
                color: "var(--foreground)",
                fontSize: "1.5rem",
                fontWeight: 500,
              }}
            >
              Top 10 talents
            </Typography>
          </Box>
          <Box sx={{ display: "grid", gap: "0.5rem" }}>
            {userTalents.map((talent, index) =>
              talent ? (
                <TalentRow
                  defaultOpen={index === 0}
                  key={talent.id}
                  rank={index + 1}
                  talent={talent}
                />
              ) : null,
            )}
          </Box>
        </Box>
      </Box>

      {editing && <EditProfileModal open onClose={() => setEditing(false)} />}
    </Box>
  );
}

function ProfileStat({ value, label }: { value: number; label: string }) {
  return (
    <Box
      sx={{
        minWidth: "6.5rem",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        px: { xs: "0.5rem", sm: "1rem" },
        py: "0.8rem",
        bgcolor: "var(--surface)",
      }}
    >
      <Typography
        component="strong"
        sx={{
          display: "block",
          fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
          fontSize: { xs: "1.5rem", sm: "1.85rem" },
          fontWeight: 600,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
      <Typography
        component="span"
        sx={{
          display: "block",
          mt: "0.25rem",
          color: "var(--muted-foreground)",
          fontSize: "0.625rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

function AtGlanceRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "0.875rem",
      }}
    >
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "var(--muted-foreground)",
        }}
      >
        {icon}
        {label}
      </Box>
      <Box
        component="strong"
        sx={{ fontFamily: "JetBrains Mono, ui-monospace, monospace" }}
      >
        {value}
      </Box>
    </Box>
  );
}

function PanelEyebrow({ children }: { children: ReactNode }) {
  return (
    <Typography
      component="h3"
      sx={{
        color: "var(--accent2)",
        fontSize: "0.75rem",
        fontWeight: 800,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </Typography>
  );
}

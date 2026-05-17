import { useMemo } from "react";
import FavoriteBorderRounded from "@mui/icons-material/FavoriteBorderRounded";
import { Box, Card, Typography } from "@mui/material";
import { AvatarBubble } from "../../common/AvatarBubble";
import { DomainTag } from "../../common/DomainTag";
import { EmptyState } from "../../common/EmptyState";
import { timeAgo } from "../../../lib/utils/format";
import { useCurrentUser } from "../../../services/authService";
import {
  useKudos,
  useTalents,
  useUsers,
} from "../../../services/workspaceService";
import { ActivityFeed } from "../activity/ActivityFeed";

export function KudosTab() {
  const user = useCurrentUser();
  const kudos = useKudos();
  const users = useUsers();
  const talents = useTalents();

  const myKudos = useMemo(() => {
    if (!user) return [];

    return kudos
      .filter((item) => item.toId === user.id)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [kudos, user]);

  if (!user) return null;

  if (myKudos.length === 0) {
    return (
      <EmptyState
        large
        title="No kudos yet"
        description="When teammates send you appreciation, it'll show up here."
      />
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        width: "min(100%, 48rem)",
        mx: "auto",
        gap: "1.5rem",
      }}
    >
      <Box component="section">
        <Typography
          component="h2"
          sx={{
            color: "var(--foreground)",
            fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
            fontSize: "1.25rem",
            fontWeight: 700,
          }}
        >
          Things people noticed
        </Typography>
        <Typography
          sx={{
            mt: "0.25rem",
            color: "var(--muted-foreground)",
            fontSize: "0.875rem",
          }}
        >
          A wall of appreciation from your team.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: "1rem",
        }}
      >
        {myKudos.map((item) => {
          const from = users.find((candidate) => candidate.id === item.fromId);
          const talent = talents.find(
            (candidate) => candidate.id === item.talentId,
          );

          return (
            <Card
              key={item.id}
              sx={{
                position: "relative",
                overflow: "hidden",
                p: "1.5rem",
                borderRadius: "0.875rem",
                boxShadow: "none",
              }}
            >
              <FavoriteBorderRounded
                sx={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  color: "var(--accent2)",
                }}
              />
              <Typography
                component="blockquote"
                sx={{
                  m: 0,
                  pr: "1.5rem",
                  fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  lineHeight: 1.35,
                }}
              >
                "{item.message}"
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  mt: "1.25rem",
                }}
              >
                <AvatarBubble value={from?.avatar} size={40} />
                <Box sx={{ display: "grid", minWidth: 0, flex: 1 }}>
                  <strong>{from?.name}</strong>
                  <Box
                    component="span"
                    sx={{
                      color: "var(--muted-foreground)",
                      fontSize: "0.75rem",
                    }}
                  >
                    {timeAgo(item.createdAt)}
                  </Box>
                </Box>
                {talent && (
                  <DomainTag
                    compact
                    domain={talent.category}
                    label={talent.label}
                  />
                )}
              </Box>
            </Card>
          );
        })}
      </Box>

      <Box
        component="section"
        sx={{ display: "grid", gap: "1rem", mt: "1rem" }}
      >
        <Typography
          component="h3"
          sx={{
            color: "var(--foreground)",
            fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
            fontSize: "1.25rem",
            fontWeight: 700,
          }}
        >
          Recent personal activity
        </Typography>
        <ActivityFeed
          filter={(event) =>
            event.actorId === user.id || event.targetId === user.id
          }
        />
      </Box>
    </Box>
  );
}

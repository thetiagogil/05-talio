import { useMemo, type ReactNode } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ArticleRounded,
  EmojiEventsRounded,
  FavoriteBorderRounded,
  StarBorderRounded,
} from "@mui/icons-material";
import { Box, Card, Typography } from "@mui/material";
import { ActivityFeed } from "../components/features/activity/ActivityFeed";
import { AppShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";
import { useCurrentUser } from "../services/authService";
import { useActivity, useKudos, useUsers } from "../services/workspaceService";
import type { ActivityEvent } from "../types/talents";

type ActivityTab = "all" | "kudos" | "goals" | "manuals" | "mine";

const activityTabs: { id: ActivityTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "kudos", label: "Kudos" },
  { id: "goals", label: "Goals" },
  { id: "manuals", label: "Manuals" },
  { id: "mine", label: "Mine" },
];

const weekStart = Date.now() - 7 * 86400000;

const isActivityTab = (tab: string | undefined): tab is ActivityTab =>
  activityTabs.some((item) => item.id === tab);

export function ActivityPage() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const events = useActivity();
  const users = useUsers();
  const kudos = useKudos();
  const activeTab = isActivityTab(tab) ? tab : "all";

  const stats = useMemo(
    () => ({
      kudos: kudos.filter((item) => item.createdAt > weekStart).length,
      goalsCompleted: events.filter(
        (event) =>
          event.type === "goal_completed" && event.createdAt > weekStart,
      ).length,
      manuals: events.filter(
        (event) =>
          (event.type === "manual_updated" || event.type === "joined") &&
          event.createdAt > weekStart,
      ).length,
      active: new Set(
        events
          .filter((event) => event.createdAt > weekStart)
          .map((event) => event.actorId),
      ).size,
    }),
    [events, kudos],
  );

  function filter(event: ActivityEvent) {
    if (activeTab === "all") return true;
    if (activeTab === "mine" && currentUser) {
      return (
        event.actorId === currentUser.id || event.targetId === currentUser.id
      );
    }
    if (activeTab === "kudos") return event.type === "kudos_sent";
    if (activeTab === "goals") return event.type.startsWith("goal_");
    if (activeTab === "manuals") {
      return event.type === "manual_updated" || event.type === "joined";
    }

    return true;
  }

  if (!isActivityTab(tab)) {
    return <Navigate replace to="/activity/all" />;
  }

  return (
    <AppShell>
      <PageHeader
        title="Activity"
        description="A living feed of what your team is working on, sharing, and celebrating."
        tabs={activityTabs}
        activeTab={activeTab}
        onTabChange={(nextTab) => navigate(`/activity/${nextTab}`)}
      />

      <Box sx={{ p: { xs: "2rem 1rem", md: "2rem" } }}>
        <Box
          sx={{
            display: "grid",
            width: "min(100%, 56rem)",
            mx: "auto",
            gap: "1.5rem",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: "0.75rem",
            }}
          >
            <ActivityStat
              tone="accent"
              icon={<FavoriteBorderRounded />}
              label="Kudos this week"
              value={stats.kudos}
            />
            <ActivityStat
              tone="done"
              icon={<EmojiEventsRounded />}
              label="Goals completed"
              value={stats.goalsCompleted}
            />
            <ActivityStat
              tone="relationship"
              icon={<ArticleRounded />}
              label="Manual updates"
              value={stats.manuals}
            />
            <ActivityStat
              tone="strategic"
              icon={<StarBorderRounded />}
              label="Teammates active"
              value={`${stats.active}/${users.length}`}
            />
          </Box>

          <ActivityFeed filter={filter} />
        </Box>
      </Box>
    </AppShell>
  );
}

function ActivityStat({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  tone: "accent" | "done" | "relationship" | "strategic";
}) {
  const styles = {
    accent: {
      color: "var(--accent2)",
      bg: "color-mix(in oklch, var(--accent2) 10%, transparent)",
    },
    done: {
      color: "var(--progress-done)",
      bg: "var(--progress-done-soft)",
    },
    relationship: {
      color: "var(--domain-relationship)",
      bg: "var(--domain-relationship-soft)",
    },
    strategic: {
      color: "var(--domain-strategic)",
      bg: "var(--domain-strategic-soft)",
    },
  }[tone];

  return (
    <Card sx={{ p: "1rem", borderRadius: "0.875rem", boxShadow: "none" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
        <Box
          component="span"
          sx={{
            display: "grid",
            width: "2rem",
            height: "2rem",
            flex: "none",
            placeItems: "center",
            borderRadius: "0.75rem",
            color: styles.color,
            bgcolor: styles.bg,
          }}
        >
          {icon}
        </Box>
        <Box
          component="span"
          sx={{ display: "grid", gap: "0.25rem", minWidth: 0 }}
        >
          <Typography
            component="strong"
            sx={{
              display: "block",
              fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
              fontSize: "1.5rem",
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>
          <Typography
            component="small"
            sx={{ color: "var(--muted-foreground)", lineHeight: 1.25 }}
          >
            {label}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

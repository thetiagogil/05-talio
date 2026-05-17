import {
  ArticleRounded,
  HeadphonesRounded,
  PlayCircleOutlineRounded,
  StarBorderRounded,
} from "@mui/icons-material";
import { Box, Button, Card, Typography } from "@mui/material";
import { useMemo, useState, type ReactNode } from "react";
import { DomainTag } from "../components/common/DomainTag";
import { AppShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";
import { LEARNING_RESOURCES } from "../data/resources";
import { DOMAINS } from "../lib/constants/talentConstants";
import { domainStyle } from "../lib/utils/styleUtils";
import { useCurrentUser } from "../services/authService";
import { useTalents } from "../services/workspaceService";
import type { Domain, LearningResource } from "../types/talents";

type Filter = Domain | "All" | "For me";

export function LearnPage() {
  const currentUser = useCurrentUser();
  const talents = useTalents();
  const [filter, setFilter] = useState<Filter>("For me");

  const myTalentLabels = useMemo(() => {
    if (!currentUser) return new Set<string>();

    return new Set(
      currentUser.talents
        .map((id) => talents.find((talent) => talent.id === id)?.label)
        .filter((label): label is string => Boolean(label)),
    );
  }, [currentUser, talents]);

  const resources = useMemo(() => {
    if (filter === "All") return LEARNING_RESOURCES;
    if (filter === "For me") {
      return [...LEARNING_RESOURCES].sort((a, b) => {
        const aMatch = a.tags.filter((tag) => myTalentLabels.has(tag)).length;
        const bMatch = b.tags.filter((tag) => myTalentLabels.has(tag)).length;
        return bMatch - aMatch;
      });
    }

    return LEARNING_RESOURCES.filter((resource) => resource.domain === filter);
  }, [filter, myTalentLabels]);

  return (
    <AppShell>
      <PageHeader
        title="Learn"
        description="Learning paths that connect strengths to practical formats: reading, talks, podcasts, and exercises."
      />

      <Box sx={{ p: { xs: "2rem 1rem", md: "2rem" } }}>
        <Box sx={{ width: "min(100%, 72rem)", mx: "auto" }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {(["For me", "All", ...DOMAINS] as const).map((item) => (
              <Button
                key={item}
                variant={filter === item ? "contained" : "outlined"}
                onClick={() => setFilter(item)}
                sx={{ borderRadius: 999 }}
              >
                {item}
              </Button>
            ))}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: "1rem",
              mt: "1.5rem",
            }}
          >
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                matched={resource.tags.filter((tag) => myTalentLabels.has(tag))}
                resource={resource}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </AppShell>
  );
}

function ResourceCard({
  resource,
  matched,
}: {
  resource: LearningResource;
  matched: string[];
}) {
  const style = domainStyle(resource.domain);

  return (
    <Card
      sx={{
        display: "flex",
        minHeight: "14rem",
        flexDirection: "column",
        p: "1.5rem",
        boxShadow: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.75rem",
        }}
      >
        <DomainTag compact domain={resource.domain} />
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            borderRadius: 999,
            px: "0.5rem",
            py: "0.18rem",
            color: style.base,
            bgcolor: style.soft,
            fontSize: "0.75rem",
            fontWeight: 700,
          }}
        >
          {resourceIcon(resource.type)}
          {resource.type}
        </Box>
        <Typography
          component="time"
          sx={{
            ml: "auto",
            color: "var(--muted-foreground)",
            fontSize: "0.75rem",
          }}
        >
          {resource.minutes} min
        </Typography>
      </Box>

      <Typography
        component="h3"
        sx={{
          mt: "0.85rem",
          color: "var(--foreground)",
          fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
          fontSize: "1.25rem",
          fontWeight: 700,
          lineHeight: 1.25,
        }}
      >
        {resource.title}
      </Typography>
      <Typography
        sx={{
          mt: "0.35rem",
          color: "var(--muted-foreground)",
          fontSize: "0.875rem",
        }}
      >
        {resource.source}
      </Typography>

      <Box
        component="footer"
        sx={{ display: "grid", gap: "0.5rem", mt: "auto", pt: "1.25rem" }}
      >
        <Typography
          component="span"
          sx={{
            color: "var(--muted-foreground)",
            fontSize: "0.75rem",
            fontWeight: 700,
          }}
        >
          Supports
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {(matched.length > 0 ? matched : resource.tags.slice(0, 3)).map(
            (tag) => (
              <Box
                component="small"
                key={tag}
                sx={{
                  borderRadius: 999,
                  px: "0.5rem",
                  py: "0.18rem",
                  color: style.base,
                  bgcolor: style.soft,
                  fontSize: "0.7rem",
                }}
              >
                {tag}
              </Box>
            ),
          )}
        </Box>
      </Box>
    </Card>
  );
}

function resourceIcon(type: LearningResource["type"]): ReactNode {
  if (type === "Article") return <ArticleRounded fontSize="inherit" />;
  if (type === "Talk") return <PlayCircleOutlineRounded fontSize="inherit" />;
  if (type === "Podcast") return <HeadphonesRounded fontSize="inherit" />;
  return <StarBorderRounded fontSize="inherit" />;
}

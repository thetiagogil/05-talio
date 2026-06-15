import GroupsRounded from "@mui/icons-material/GroupsRounded";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Typography,
} from "@mui/material";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import { useMemo, useState } from "react";
import { domainStyle } from "@/shared/utils/style-utils";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { useTalents } from "@/features/talents/hooks/useTalents";
import { useUsers } from "@/features/users/hooks/useUsers";
import type { User } from "@/types/talents";
import { AvatarBubble } from "@/features/users/components/AvatarBubble";
import { DomainTag } from "@/features/talents/components/DomainTag";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import {
  getTeamDomainStats,
  getTeamTopTalents,
} from "@/features/team/lib/teamInsights";

export function DefaultOverview() {
  const users = useUsers();
  const talents = useTalents();
  const currentUser = useCurrentUser();
  const [expanded, setExpanded] = useState<string | false>(false);

  const domainStats = useMemo(
    () => getTeamDomainStats(users, talents),
    [talents, users],
  );

  const topTalents = useMemo(
    () => getTeamTopTalents(users, talents),
    [talents, users],
  );

  return (
    <Box sx={{ display: "grid", gap: "2rem" }}>
      <Box component="section" sx={{ display: "grid", gap: "0.25rem" }}>
        <Typography
          component="h2"
          sx={{
            color: "var(--foreground)",
            fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
            fontSize: "1.25rem",
            fontWeight: 700,
          }}
        >
          Team domains
        </Typography>
        <Typography
          sx={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}
        >
          How your team's strengths are distributed.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              xl: "repeat(4, minmax(0, 1fr))",
            },
            gap: "0.75rem",
            mt: "0.75rem",
          }}
        >
          {domainStats.map(({ domain, totalTalents }) => {
            const style = domainStyle(domain);

            return (
              <Card
                key={domain}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  bgcolor: style.soft,
                  boxShadow: "none",
                  p: "1.25rem",
                  display: "flex",
                  minHeight: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.85rem",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    minWidth: 0,
                    alignItems: "center",
                    gap: "0.55rem",
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
                  <Typography
                    component="h3"
                    sx={{
                      minWidth: 0,
                      color: style.text,
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      lineHeight: 1.25,
                    }}
                  >
                    {domain}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flex: "none", ml: "auto" }}>
                  <Typography
                    component="span"
                    sx={{
                      color: "var(--muted-foreground)",
                      fontSize: "0.625rem",
                      lineHeight: 1.15,
                    }}
                  >
                    <Box
                      component="strong"
                      sx={{
                        display: "block",
                        color: style.text,
                        fontFamily:
                          "Plus Jakarta Sans, Inter, system-ui, sans-serif",
                        fontSize: "1.25rem",
                        lineHeight: 1,
                      }}
                    >
                      {totalTalents}
                    </Box>
                    talents
                  </Typography>
                </Box>
              </Card>
            );
          })}
        </Box>
      </Box>

      <Box component="section" sx={{ display: "grid", gap: "0.25rem" }}>
        <Typography
          component="h2"
          sx={{
            color: "var(--foreground)",
            fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
            fontSize: "1.25rem",
            fontWeight: 700,
          }}
        >
          Team top talents
        </Typography>
        <Typography
          sx={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}
        >
          Strengths that show up most across the team.
        </Typography>
        {topTalents.length === 0 ? (
          <Box sx={{ mt: "0.75rem" }}>
            <EmptyState description="No team talents are available yet." />
          </Box>
        ) : (
          <Box sx={{ display: "grid", gap: "0.75rem", mt: "0.75rem" }}>
            {topTalents.map(({ talent, userIds }, index) => {
              const people = userIds
                .map((userId) =>
                  users.find((candidate) => candidate.id === userId),
                )
                .filter((user): user is User => Boolean(user));
              const peopleLabel = `${people.length} ${
                people.length === 1 ? "person" : "people"
              }`;

              return (
                <Accordion
                  disableGutters
                  expanded={expanded === String(talent.id)}
                  key={talent.id}
                  onChange={(_, nextExpanded) =>
                    setExpanded(nextExpanded ? String(talent.id) : false)
                  }
                  sx={{
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                    borderRadius: "0.875rem !important",
                    bgcolor: "var(--card)",
                    boxShadow: "none",
                    "&::before": { display: "none" },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<KeyboardArrowDownRounded />}
                    sx={{
                      alignItems: "center",
                      p: "1rem",
                      "& .MuiAccordionSummary-content": { m: 0, minWidth: 0 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        width: "100%",
                        gridTemplateColumns: {
                          xs: "2rem minmax(0, 1fr)",
                          sm: "2rem minmax(0, 1fr) auto",
                        },
                        alignItems: "center",
                        gap: "0.9rem",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: "grid",
                          width: "2rem",
                          height: "2rem",
                          placeItems: "center",
                          borderRadius: "0.625rem",
                          color: "var(--primary)",
                          bgcolor: "var(--accent)",
                          fontFamily:
                            "Plus Jakarta Sans, Inter, system-ui, sans-serif",
                          fontSize: "0.875rem",
                          fontWeight: 800,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          minWidth: 0,
                          alignItems: { xs: "flex-start", sm: "center" },
                          flexDirection: { xs: "column", sm: "row" },
                          gap: { xs: "0.35rem", sm: "0.6rem" },
                        }}
                      >
                        <DomainTag
                          compact
                          domain={talent.category}
                          label={talent.label}
                        />
                        <Typography
                          sx={{
                            maxWidth: "38rem",
                            color: "var(--muted-foreground)",
                            fontSize: "0.8125rem",
                            lineHeight: 1.45,
                          }}
                        >
                          {talent.description}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: { xs: "flex-start", sm: "flex-end" },
                          gridColumn: { xs: "2", sm: "auto" },
                          gap: "0.75rem",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            flex: "none",
                            color: "var(--muted-foreground)",
                            fontSize: "0.75rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <GroupsRounded fontSize="small" /> {peopleLabel}
                        </Box>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{ p: { xs: "0 1rem 1rem", sm: "0 1rem 1rem 3.75rem" } }}
                  >
                    <Box sx={{ display: "grid", gap: "0.9rem" }}>
                      <Box
                        sx={{
                          display: "grid",
                          gap: "0.2rem",
                          borderRadius: "0.625rem",
                          p: "0.75rem 0.85rem",
                          bgcolor: "var(--surface-2)",
                        }}
                      >
                        <Typography
                          component="strong"
                          sx={{
                            color: "var(--muted-foreground)",
                            fontSize: "0.65rem",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          Brings
                        </Typography>
                        <Typography
                          component="span"
                          sx={{ fontSize: "0.8125rem", lineHeight: 1.45 }}
                        >
                          {talent.details.bring}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.4rem",
                        }}
                      >
                        {people.map((user) => (
                          <Box
                            component="span"
                            key={user.id}
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.4rem",
                              borderRadius: 999,
                              px: "0.55rem",
                              py: "0.25rem",
                              bgcolor: "var(--muted)",
                              fontSize: "0.75rem",
                            }}
                          >
                            <AvatarBubble value={user.avatar} size={24} />
                            <strong>{user.name}</strong>
                            <Box
                              component="small"
                              sx={{ color: "var(--muted-foreground)" }}
                            >
                              {user.role}
                            </Box>
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
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}

import { useMemo, type ReactNode } from "react";
import { FavoriteBorderRounded, StarBorderRounded } from "@mui/icons-material";
import { Box, Card, Typography } from "@mui/material";
import { AvatarBubble } from "@/features/users/components/AvatarBubble";
import { DOMAINS } from "@/features/talents/constants";
import { domainStyle } from "@/shared/utils/style-utils";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { useKudos } from "@/features/kudos/hooks/useKudos";
import { useTalents } from "@/features/talents/hooks/useTalents";
import { useUsers } from "@/features/users/hooks/useUsers";
import type { Talent, User } from "@/types/talents";

export function TeamChemistry() {
  const users = useUsers();
  const talents = useTalents();
  const kudos = useKudos();
  const currentUser = useCurrentUser();

  const domainTopThree = useMemo(
    () =>
      DOMAINS.map((domain) => ({
        domain,
        count: users.reduce((sum, user) => {
          const topThree = user.talents.slice(0, 3);
          return (
            sum +
            topThree.filter(
              (talentId) =>
                talents.find((talent) => talent.id === talentId)?.category ===
                domain,
            ).length
          );
        }, 0),
      })).sort((a, b) => a.count - b.count),
    [talents, users],
  );

  const weakest = domainTopThree[0];
  const strongest = domainTopThree[domainTopThree.length - 1];

  const topReceivers = useMemo(() => {
    const counts = new Map<string, number>();

    kudos.forEach((item) => {
      counts.set(item.toId, (counts.get(item.toId) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => ({
        user: users.find((candidate) => candidate.id === id),
        count,
      }))
      .filter((row): row is { user: User; count: number } => Boolean(row.user));
  }, [kudos, users]);

  return (
    <Box
      sx={{
        display: "grid",
        width: "min(100%, 64rem)",
        mx: "auto",
        gap: "1.5rem",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: "1rem",
        }}
      >
        <ChemistryDomainCard
          eyebrow="Team superpower"
          title={strongest.domain}
          text={`${strongest.count} top-3 talents land here. This is where your team naturally shines.`}
        />
        <ChemistryDomainCard
          eyebrow="Watch the gap"
          title={weakest.domain}
          text={`Only ${weakest.count} top-3 talents here. Worth pairing intentionally on these efforts.`}
        />
      </Box>

      <Card sx={{ p: "1.5rem", boxShadow: "none" }}>
        <PanelTitle icon={<FavoriteBorderRounded />}>
          Most appreciated
        </PanelTitle>
        <PanelDescription>
          Teammates who've received the most kudos.
        </PanelDescription>
        <Box sx={{ display: "grid", gap: "0.5rem", mt: "1rem" }}>
          {topReceivers.length === 0 ? (
            <Typography
              component="span"
              sx={{ color: "var(--muted-foreground)" }}
            >
              No kudos sent yet.
            </Typography>
          ) : (
            topReceivers.map(({ user, count }, index) => (
              <Box
                key={user.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  border: "1px solid var(--border)",
                  borderRadius: "0.625rem",
                  p: "0.75rem",
                  bgcolor: "var(--background)",
                }}
              >
                <Typography
                  component="small"
                  sx={{
                    width: "1.25rem",
                    color: "var(--muted-foreground)",
                    fontFamily: "JetBrains Mono, ui-monospace, monospace",
                  }}
                >
                  {index + 1}
                </Typography>
                <AvatarBubble value={user.avatar} size={32} />
                <Box component="span" sx={{ display: "grid", flex: 1 }}>
                  <strong>
                    {user.name}
                    {user.id === currentUser?.id && <em> (me)</em>}
                  </strong>
                  <Box
                    component="small"
                    sx={{ color: "var(--muted-foreground)" }}
                  >
                    {user.role}
                  </Box>
                </Box>
                <Box
                  component="b"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    borderRadius: 999,
                    px: "0.75rem",
                    py: "0.25rem",
                    color: "var(--accent2)",
                    bgcolor:
                      "color-mix(in oklch, var(--accent2) 10%, transparent)",
                  }}
                >
                  <FavoriteBorderRounded fontSize="small" /> {count}
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Card>

      <Card sx={{ p: "1.5rem", boxShadow: "none" }}>
        <PanelTitle icon={<StarBorderRounded />}>Pairings to try</PanelTitle>
        <PanelDescription>
          Complementary teammates worth working with.
        </PanelDescription>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: "0.5rem",
            mt: "1rem",
          }}
        >
          {pairings(users, talents).map(({ first, second, reason }) => (
            <Box
              key={`${first.id}-${second.id}`}
              sx={{
                border: "1px solid var(--border)",
                borderRadius: "0.875rem",
                p: "1rem",
                bgcolor: "var(--background)",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <AvatarBubble value={first.avatar} size={32} />
                <span>+</span>
                <AvatarBubble value={second.avatar} size={32} />
              </Box>
              <Typography
                component="strong"
                sx={{ display: "block", mt: "0.75rem" }}
              >
                {first.name} &amp; {second.name}
              </Typography>
              <Typography
                sx={{
                  mt: "0.35rem",
                  color: "var(--muted-foreground)",
                  fontSize: "0.75rem",
                  lineHeight: 1.55,
                }}
              >
                {reason}
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
}

function ChemistryDomainCard({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: (typeof DOMAINS)[number];
  text: string;
}) {
  const style = domainStyle(title);

  return (
    <Card
      sx={{
        p: "1.5rem",
        borderRadius: "0.875rem",
        bgcolor: style.soft,
        boxShadow: "none",
      }}
    >
      <Typography
        sx={{
          color: "var(--accent2)",
          fontSize: "0.75rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {eyebrow}
      </Typography>
      <Typography
        component="h3"
        sx={{
          mt: "0.5rem",
          color: style.text,
          fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
          fontSize: "2rem",
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
      <Typography
        component="span"
        sx={{ display: "block", mt: "0.5rem", lineHeight: 1.55 }}
      >
        {text}
      </Typography>
    </Card>
  );
}

function PanelTitle({
  children,
  icon,
}: {
  children: ReactNode;
  icon: ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <Box
        sx={{ color: "var(--accent2)", fontSize: "1.2rem", display: "flex" }}
      >
        {icon}
      </Box>
      <Typography
        component="h3"
        sx={{
          color: "var(--foreground)",
          fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
          fontSize: "1.25rem",
          fontWeight: 700,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

function PanelDescription({ children }: { children: ReactNode }) {
  return (
    <Typography
      sx={{
        mt: "0.25rem",
        color: "var(--muted-foreground)",
        fontSize: "0.875rem",
      }}
    >
      {children}
    </Typography>
  );
}

function pairings(users: User[], talents: Talent[]) {
  const out: { first: User; second: User; reason: string }[] = [];

  for (let i = 0; i < users.length && out.length < 4; i += 1) {
    for (let j = i + 1; j < users.length && out.length < 4; j += 1) {
      const first = users[i];
      const second = users[j];
      const firstDomains = new Set(
        first.talents
          .slice(0, 5)
          .map((id) => talents.find((talent) => talent.id === id)?.category),
      );
      const secondDomains = new Set(
        second.talents
          .slice(0, 5)
          .map((id) => talents.find((talent) => talent.id === id)?.category),
      );
      const overlap = [...firstDomains].filter(
        (domain) => domain && secondDomains.has(domain),
      );
      const complement = [...firstDomains].filter(
        (domain) => domain && !secondDomains.has(domain),
      );

      if (overlap.length === 1 && complement.length >= 2) {
        out.push({
          first,
          second,
          reason: `Shared ground in ${overlap[0]}, with complementary strengths in ${complement
            .slice(0, 2)
            .join(" & ")}.`,
        });
      }
    }
  }

  return out;
}

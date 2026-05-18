import { useMemo, type ReactNode } from "react";
import { CloseRounded, DeleteOutlineRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { AvatarBubble } from "@/features/users/components/AvatarBubble";
import { DomainTag } from "@/features/talents/components/DomainTag";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { DOMAINS } from "@/features/talents/constants";
import { shortDomain } from "@/shared/utils/style-utils";
import type { Domain, Talent, User } from "@/types/talents";

const palette = ["#5b6cf6", "#ef8a4a", "#3eb6a3", "#c45cb0", "#f5b454"];

type ComparePanelProps = {
  selected: User[];
  talents: Talent[];
  onRemove: (id: string) => void;
  onClear: () => void;
};

type CombinedTalentRow = {
  key: number;
  talent: Talent;
  count: number;
};

export function ComparePanel({
  selected,
  talents,
  onRemove,
  onClear,
}: ComparePanelProps) {
  const radarData = useMemo(
    () =>
      DOMAINS.map((domain) => ({
        domain,
        label: shortDomain(domain),
        values: selected.map((user) => ({
          userId: user.id,
          userName: user.name,
          score: user.talents.reduce((sum, talentId, index) => {
            const talent = talents.find(
              (candidate) => candidate.id === talentId,
            );
            if (!talent || talent.category !== domain) return sum;
            return sum + (10 - index);
          }, 0),
        })),
      })),
    [selected, talents],
  );

  const combinedTalents = useMemo<CombinedTalentRow[]>(() => {
    const counts = new Map<number, number>();

    selected.forEach((user) => {
      user.talents.forEach((talentId) => {
        counts.set(talentId, (counts.get(talentId) ?? 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0] - b[0])
      .slice(0, 5)
      .map(([id, count]) => {
        const talent = talents.find((candidate) => candidate.id === id);
        return talent ? { key: talent.id, talent, count } : null;
      })
      .filter((item): item is CombinedTalentRow => Boolean(item));
  }, [selected, talents]);

  if (selected.length === 0) {
    return (
      <EmptyState
        large
        title="No one selected yet"
        description="Pick up to 5 teammates to compare strengths and overlaps."
      />
    );
  }

  return (
    <Box sx={{ display: "grid", gap: "1.5rem" }}>
      <Card sx={{ p: "0.75rem", boxShadow: "none" }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {selected.map((user, index) => (
            <Box
              component="button"
              type="button"
              key={user.id}
              aria-label={`Remove ${user.name} from comparison`}
              onClick={() => onRemove(user.id)}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                border: 0,
                borderRadius: 999,
                px: "0.75rem",
                py: "0.25rem",
                bgcolor: `${palette[index]}22`,
                color: palette[index],
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.875rem",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: `${palette[index]}33`,
                },
              }}
            >
              <AvatarBubble value={user.avatar} size={24} />
              {user.name}
              <CloseRounded sx={{ fontSize: "1rem" }} />
            </Box>
          ))}
          <Button
            size="small"
            startIcon={<DeleteOutlineRounded />}
            variant="text"
            onClick={onClear}
            sx={{ ml: "auto" }}
          >
            Clear all
          </Button>
        </Box>
      </Card>

      <Card
        sx={{ display: "grid", gap: "0.25rem", p: "1.5rem", boxShadow: "none" }}
      >
        <PanelTitle>Domain comparison</PanelTitle>
        <PanelDescription>Weighted strength by talent rank.</PanelDescription>
        <RadarPlot data={radarData} users={selected} />
      </Card>

      <Card sx={{ p: "1.5rem", boxShadow: "none" }}>
        <PanelTitle>Combined top talents</PanelTitle>
        <PanelDescription>
          What this group brings, needs, and is motivated by.
        </PanelDescription>
        <Box sx={{ mt: "1rem", overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Talent</TableCell>
                <TableCell>Brings</TableCell>
                <TableCell>Needs</TableCell>
                <TableCell>Motivated by</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {combinedTalents.map((row) => (
                <TableRow key={row.key}>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <DomainTag
                        compact
                        domain={row.talent.category}
                        label={row.talent.label}
                      />
                      <Box
                        component="span"
                        sx={{
                          color: "var(--muted-foreground)",
                          fontSize: "0.75rem",
                        }}
                      >
                        {row.count} of {selected.length}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{row.talent.details.bring}</TableCell>
                  <TableCell>{row.talent.details.need}</TableCell>
                  <TableCell>{row.talent.details.motivate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}

function RadarPlot({
  data,
  users,
}: {
  data: {
    domain: Domain;
    label: string;
    values: { userId: string; userName: string; score: number }[];
  }[];
  users: User[];
}) {
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const maxScore = Math.max(
    1,
    ...data.flatMap((row) => row.values.map((value) => value.score)),
  );

  function point(index: number, score: number, scale = 1) {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
    const distance = radius * scale * (score / maxScore);

    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
    };
  }

  function labelPoint(index: number) {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;

    return {
      x: center + Math.cos(angle) * (radius + 16),
      y: center + Math.sin(angle) * (radius + 16),
    };
  }

  return (
    <Box sx={{ display: "grid", justifyItems: "center", mt: "1rem" }}>
      <Box
        component="svg"
        aria-label="Domain comparison chart"
        viewBox={`0 0 ${size} ${size}`}
        sx={{
          display: "block",
          width: "min(100%, 18.75rem)",
          height: "auto",
        }}
      >
        {[0.25, 0.5, 0.75, 1].map((scale) => {
          const points = data
            .map((_, index) => {
              const next = point(index, maxScore, scale);
              return `${next.x},${next.y}`;
            })
            .join(" ");

          return (
            <polygon
              fill="none"
              key={scale}
              points={points}
              stroke="var(--border)"
              strokeWidth="1"
            />
          );
        })}

        {data.map((row, index) => {
          const axis = point(index, maxScore);
          const label = labelPoint(index);

          return (
            <g key={row.domain}>
              <line
                x1={center}
                y1={center}
                x2={axis.x}
                y2={axis.y}
                stroke="var(--border)"
                strokeWidth="1"
              />
              <text
                dominantBaseline="middle"
                fill="var(--muted-foreground)"
                fontSize="0.75rem"
                textAnchor="middle"
                x={label.x}
                y={label.y}
              >
                {row.label}
              </text>
            </g>
          );
        })}

        {users.map((user, userIndex) => {
          const points = data
            .map((row, index) => {
              const score =
                row.values.find((value) => value.userId === user.id)?.score ??
                0;
              const next = point(index, score);
              return `${next.x},${next.y}`;
            })
            .join(" ");

          return (
            <polygon
              fill={palette[userIndex]}
              key={user.id}
              opacity="0.32"
              points={points}
              stroke={palette[userIndex]}
              strokeWidth="2"
            />
          );
        })}
      </Box>
    </Box>
  );
}

function PanelTitle({ children }: { children: ReactNode }) {
  return (
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

import { Box } from "@mui/material";
import { comparePalette } from "@/features/team/lib/compare-palette";
import type { CompareRadarRow } from "@/features/team/lib/teamInsights";
import type { User } from "@/types/talents";

type CompareRadarPlotProps = {
  data: CompareRadarRow[];
  users: User[];
};

export const CompareRadarPlot = ({ data, users }: CompareRadarPlotProps) => {
  const size = 340;
  const center = size / 2;
  const radius = 118;
  const maxScore = Math.max(
    1,
    ...data.flatMap((row) => row.values.map((value) => value.score)),
  );

  const getPoint = (index: number, score: number, scale = 1) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
    const distance = radius * scale * (score / maxScore);

    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
    };
  };

  const getLabelPoint = (index: number) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;

    return {
      x: center + Math.cos(angle) * (radius + 16),
      y: center + Math.sin(angle) * (radius + 16),
    };
  };

  return (
    <Box sx={{ display: "grid", justifyItems: "center", mt: "1rem" }}>
      <Box
        component="svg"
        aria-label="Domain comparison chart"
        role="img"
        viewBox={`0 0 ${size} ${size}`}
        sx={{
          display: "block",
          width: "min(100%, 24rem)",
          height: "auto",
        }}
      >
        <title>Domain comparison chart</title>
        {[0.25, 0.5, 0.75, 1].map((scale) => {
          const points = data
            .map((_, index) => {
              const next = getPoint(index, maxScore, scale);
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
          const axis = getPoint(index, maxScore);
          const label = getLabelPoint(index);

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
              const next = getPoint(index, score);
              return `${next.x},${next.y}`;
            })
            .join(" ");

          return (
            <polygon
              fill={comparePalette[userIndex]}
              key={user.id}
              opacity="0.32"
              points={points}
              stroke={comparePalette[userIndex]}
              strokeWidth="2"
            />
          );
        })}
      </Box>
    </Box>
  );
};

import { Box, Card, Typography } from "@mui/material";
import { TeamSectionHeading } from "@/features/team/components/TeamSectionHeading";
import { domainStyle } from "@/shared/utils/style-utils";
import type { TeamDomainStat } from "@/features/team/lib/teamInsights";

type TeamDomainStatsSectionProps = {
  stats: TeamDomainStat[];
};

export const TeamDomainStatsSection = ({
  stats,
}: TeamDomainStatsSectionProps) => {
  return (
    <Box component="section" sx={{ display: "grid", gap: "0.25rem" }}>
      <TeamSectionHeading description="How your team's strengths are distributed.">
        Team domains
      </TeamSectionHeading>
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
        {stats.map((stat) => (
          <TeamDomainStatCard key={stat.domain} stat={stat} />
        ))}
      </Box>
    </Box>
  );
};

const TeamDomainStatCard = ({ stat }: { stat: TeamDomainStat }) => {
  const style = domainStyle(stat.domain);

  return (
    <Card
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
          {stat.domain}
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
              fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
              fontSize: "1.25rem",
              lineHeight: 1,
            }}
          >
            {stat.totalTalents}
          </Box>
          talents
        </Typography>
      </Box>
    </Card>
  );
};

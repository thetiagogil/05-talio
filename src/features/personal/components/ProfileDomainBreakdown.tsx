import { Box, Card, LinearProgress, Typography } from "@mui/material";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { domainStyle } from "@/shared/utils/style-utils";
import type { ProfileDomainBreakdownItem } from "@/features/personal/hooks/usePersonalProfileViewModel";

type ProfileDomainBreakdownProps = {
  items: ProfileDomainBreakdownItem[];
  totalTalents: number;
};

export function ProfileDomainBreakdown({
  items,
  totalTalents,
}: ProfileDomainBreakdownProps) {
  return (
    <Card sx={{ p: "1.5rem", boxShadow: "none" }}>
      <PanelEyebrow>Domain breakdown</PanelEyebrow>
      {totalTalents === 0 ? (
        <Box sx={{ mt: "1rem" }}>
          <EmptyState description="Add talents to see your domain mix." />
        </Box>
      ) : (
        <Box sx={{ display: "grid", gap: "1rem", mt: "1.25rem" }}>
          {items.map((item) => {
            const style = domainStyle(item.domain);

            return (
              <Box key={item.domain}>
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
                    {item.domain}
                  </Box>
                  <Typography
                    component="small"
                    sx={{
                      color: "var(--muted-foreground)",
                      fontFamily: "JetBrains Mono, ui-monospace, monospace",
                      fontSize: "0.75rem",
                    }}
                  >
                    {item.count}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={item.percent}
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
      )}
    </Card>
  );
}

export function PanelEyebrow({ children }: { children: string }) {
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

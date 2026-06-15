import type { ReactNode } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";

export type PageTab = {
  id: string;
  label: string;
  disabled?: boolean;
};

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  tabs?: PageTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  right?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  right,
}: PageHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        borderBottom: "1px solid var(--border)",
        bgcolor: "color-mix(in srgb, var(--surface) 82%, transparent)",
      }}
    >
      <Box sx={{ px: { xs: "1rem", md: "2rem" }, pt: "1.75rem" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "flex-end" },
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <Box>
            {eyebrow && (
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
            )}
            <Typography
              component="h1"
              sx={{
                color: "var(--foreground)",
                fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
                fontSize: "clamp(2rem, 4vw, 2.625rem)",
                fontWeight: 650,
                lineHeight: 1.05,
              }}
            >
              {title}
            </Typography>
            {description && (
              <Typography
                sx={{
                  maxWidth: "42rem",
                  mt: "0.75rem",
                  color: "var(--muted-foreground)",
                  lineHeight: 1.6,
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
          {right && <Box>{right}</Box>}
        </Box>

        {tabs && (
          <Tabs
            aria-label={`${title} sections`}
            value={activeTab}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            onChange={(_, value) => onTabChange?.(value)}
            sx={{
              mt: "1.5rem",
              mb: "-1px",
              minHeight: "auto",
              "& .MuiTabs-indicator": { bgcolor: "var(--primary)" },
            }}
          >
            {tabs.map((tab) => (
              <Tab
                disabled={tab.disabled}
                key={tab.id}
                label={tab.label}
                value={tab.id}
                sx={{ py: "0.75rem", minHeight: "auto" }}
              />
            ))}
          </Tabs>
        )}
      </Box>
    </Box>
  );
}

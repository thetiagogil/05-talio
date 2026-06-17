import { Box, Card, Typography } from "@mui/material";
import { ResourceTypeIcon } from "./ResourceTypeIcon";
import { DomainTag } from "@/features/talents/components/DomainTag";
import { domainStyle } from "@/shared/utils/style-utils";
import type { LearningResource } from "@/types/talents";

type ResourceCardProps = {
  resource: LearningResource;
  matched: string[];
};

export const ResourceCard = ({ resource, matched }: ResourceCardProps) => {
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
          <ResourceTypeIcon type={resource.type} />
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
          {matched.length > 0 ? "Matched to your talents" : "Supports"}
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
};

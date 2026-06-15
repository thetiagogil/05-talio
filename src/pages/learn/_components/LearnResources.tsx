import { Box, Button, Typography } from "@mui/material";
import { ResourceCard } from "./ResourceCard";
import { useLearningResources } from "../hooks/useLearningResources";
import { EmptyState } from "@/shared/components/ui/EmptyState";

export function LearnResources() {
  const {
    filter,
    filterCounts,
    filters,
    matchedByResourceId,
    resources,
    setFilter,
  } = useLearningResources();
  const matchedResourceCount = filterCounts["For me"];

  return (
    <Box sx={{ width: "min(100%, 72rem)", mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <Typography
          sx={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}
        >
          {matchedResourceCount > 0
            ? `${matchedResourceCount} resources match your top talents.`
            : "Browse all learning resources by domain."}
        </Typography>
      </Box>

      <Box
        sx={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", mt: "1rem" }}
      >
        {filters.map((item) => (
          <Button
            key={item}
            aria-pressed={filter === item}
            variant={filter === item ? "contained" : "outlined"}
            onClick={() => setFilter(item)}
            sx={{ borderRadius: 999 }}
          >
            {item}{" "}
            <Box
              component="span"
              sx={{
                ml: "0.35rem",
                color: filter === item ? "inherit" : "var(--muted-foreground)",
                fontSize: "0.75rem",
              }}
            >
              {filterCounts[item]}
            </Box>
          </Button>
        ))}
      </Box>

      {resources.length === 0 ? (
        <Box sx={{ mt: "1.5rem" }}>
          <EmptyState description="No learning resources match this filter." />
        </Box>
      ) : (
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
              matched={matchedByResourceId.get(resource.id) ?? []}
              resource={resource}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

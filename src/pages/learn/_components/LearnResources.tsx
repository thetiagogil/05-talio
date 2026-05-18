import { Box, Button } from "@mui/material";
import { ResourceCard } from "./ResourceCard";
import { useLearningResources } from "../hooks/useLearningResources";

export function LearnResources() {
  const { filter, filters, matchedTalentLabels, resources, setFilter } =
    useLearningResources();

  return (
    <Box sx={{ width: "min(100%, 72rem)", mx: "auto" }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {filters.map((item) => (
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
            matched={resource.tags.filter((tag) =>
              matchedTalentLabels.has(tag),
            )}
            resource={resource}
          />
        ))}
      </Box>
    </Box>
  );
}

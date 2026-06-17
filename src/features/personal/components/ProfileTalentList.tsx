import { Box, Typography } from "@mui/material";
import { TalentRow } from "@/features/talents/components/TalentRow";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import type { Talent } from "@/types/talents";

type ProfileTalentListProps = {
  talents: Talent[];
};

export const ProfileTalentList = ({ talents }: ProfileTalentListProps) => {
  return (
    <Box component="section">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "1rem",
        }}
      >
        <Typography
          component="h2"
          sx={{
            color: "var(--foreground)",
            fontSize: "1.5rem",
            fontWeight: 500,
          }}
        >
          Top 10 talents
        </Typography>
      </Box>
      {talents.length === 0 ? (
        <EmptyState description="No talents have been added to this profile yet." />
      ) : (
        <Box sx={{ display: "grid", gap: "0.5rem" }}>
          {talents.map((talent, index) => (
            <TalentRow
              defaultOpen={index === 0}
              key={talent.id}
              rank={index + 1}
              talent={talent}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

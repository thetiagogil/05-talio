import { useMemo } from "react";
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
} from "@mui/material";
import { AvatarBubble } from "@/features/users/components/AvatarBubble";
import { CompareRadarPlot } from "@/features/team/components/CompareRadarPlot";
import { DomainTag } from "@/features/talents/components/DomainTag";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import type { Talent, User } from "@/types/talents";
import { comparePalette } from "@/features/team/lib/compare-palette";
import {
  getCombinedTopTalents,
  getCompareRadarData,
} from "@/features/team/lib/teamInsights";
import {
  TeamPanelDescription,
  TeamPanelTitle,
} from "@/features/team/components/TeamPanelText";

type ComparePanelProps = {
  selected: User[];
  talents: Talent[];
  onRemove: (id: string) => void;
  onClear: () => void;
};

export const ComparePanel = ({
  selected,
  talents,
  onRemove,
  onClear,
}: ComparePanelProps) => {
  const radarData = useMemo(
    () => getCompareRadarData(selected, talents),
    [selected, talents],
  );

  const combinedTalents = useMemo(
    () => getCombinedTopTalents(selected, talents),
    [selected, talents],
  );

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
                bgcolor: `${comparePalette[index]}22`,
                color: comparePalette[index],
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.875rem",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: `${comparePalette[index]}33`,
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
        <TeamPanelTitle>Domain comparison</TeamPanelTitle>
        <TeamPanelDescription>
          Weighted strength by talent rank.
        </TeamPanelDescription>
        <CompareRadarPlot data={radarData} users={selected} />
      </Card>

      <Card sx={{ p: "1.5rem", boxShadow: "none" }}>
        <TeamPanelTitle>Combined top talents</TeamPanelTitle>
        <TeamPanelDescription>
          What this group brings, needs, and is motivated by.
        </TeamPanelDescription>
        {combinedTalents.length === 0 ? (
          <Box sx={{ mt: "1rem" }}>
            <EmptyState description="No shared top talents were found for this group." />
          </Box>
        ) : (
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
        )}
      </Card>
    </Box>
  );
};

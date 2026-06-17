import GroupsRounded from "@mui/icons-material/GroupsRounded";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { DomainTag } from "@/features/talents/components/DomainTag";
import { TeamTopTalentDetails } from "@/features/team/components/TeamTopTalentDetails";
import type { TeamTopTalent } from "@/features/team/lib/teamInsights";
import type { User } from "@/types/talents";

type TeamTopTalentAccordionProps = {
  currentUserId?: string;
  expanded: string | false;
  index: number;
  onExpandedChange: (value: string | false) => void;
  topTalent: TeamTopTalent;
  users: User[];
};

export const TeamTopTalentAccordion = ({
  currentUserId,
  expanded,
  index,
  onExpandedChange,
  topTalent,
  users,
}: TeamTopTalentAccordionProps) => {
  const { talent, userIds } = topTalent;
  const people = userIds
    .map((userId) => users.find((candidate) => candidate.id === userId))
    .filter((user): user is User => Boolean(user));
  const peopleLabel = `${people.length} ${
    people.length === 1 ? "person" : "people"
  }`;

  return (
    <Accordion
      disableGutters
      expanded={expanded === String(talent.id)}
      onChange={(_, nextExpanded) =>
        onExpandedChange(nextExpanded ? String(talent.id) : false)
      }
      sx={{
        overflow: "hidden",
        border: "1px solid var(--border)",
        borderRadius: "0.875rem !important",
        bgcolor: "var(--card)",
        boxShadow: "none",
        "&::before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<KeyboardArrowDownRounded />}
        sx={{
          alignItems: "center",
          p: "1rem",
          "& .MuiAccordionSummary-content": { m: 0, minWidth: 0 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            width: "100%",
            gridTemplateColumns: {
              xs: "2rem minmax(0, 1fr)",
              sm: "2rem minmax(0, 1fr) auto",
            },
            alignItems: "center",
            gap: "0.9rem",
          }}
        >
          <Box
            component="span"
            sx={{
              display: "grid",
              width: "2rem",
              height: "2rem",
              placeItems: "center",
              borderRadius: "0.625rem",
              color: "var(--primary)",
              bgcolor: "var(--accent)",
              fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
              fontSize: "0.875rem",
              fontWeight: 800,
            }}
          >
            {index + 1}
          </Box>
          <Box
            sx={{
              display: "flex",
              minWidth: 0,
              alignItems: { xs: "flex-start", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: "0.35rem", sm: "0.6rem" },
            }}
          >
            <DomainTag compact domain={talent.category} label={talent.label} />
            <Typography
              sx={{
                maxWidth: "38rem",
                color: "var(--muted-foreground)",
                fontSize: "0.8125rem",
                lineHeight: 1.45,
              }}
            >
              {talent.description}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "flex-start", sm: "flex-end" },
              gridColumn: { xs: "2", sm: "auto" },
              gap: "0.75rem",
            }}
          >
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                flex: "none",
                color: "var(--muted-foreground)",
                fontSize: "0.75rem",
                whiteSpace: "nowrap",
              }}
            >
              <GroupsRounded fontSize="small" /> {peopleLabel}
            </Box>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{ p: { xs: "0 1rem 1rem", sm: "0 1rem 1rem 3.75rem" } }}
      >
        <TeamTopTalentDetails
          currentUserId={currentUserId}
          people={people}
          topTalent={topTalent}
        />
      </AccordionDetails>
    </Accordion>
  );
};

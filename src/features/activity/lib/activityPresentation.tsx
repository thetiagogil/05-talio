import { Box } from "@mui/material";
import type { ActivityEvent } from "@/types/talents";

export const ActivityPhrase = ({
  event,
  talentName,
  targetName,
}: {
  event: ActivityEvent;
  talentName?: string;
  targetName?: string;
}) => {
  switch (event.type) {
    case "kudos_sent":
      return (
        <>
          sent kudos to <strong>{targetName ?? "a teammate"}</strong>
          {talentName && <TalentName label={talentName} prefix="for" />}
        </>
      );
    case "goal_created":
      return (
        <>
          set a new goal
          {talentName && <TalentName label={talentName} prefix="linked to" />}
        </>
      );
    case "goal_progressed":
      return (
        <>
          moved a goal to <strong>{event.message}</strong>
        </>
      );
    case "goal_completed":
      return (
        <>
          completed a goal
          {talentName && <TalentName label={talentName} prefix="for" />}
        </>
      );
    case "goal_approved":
      return (
        <>
          approved <strong>{targetName ?? "a teammate"}</strong>'s goal
        </>
      );
    case "manual_updated":
      return <>updated their Manual of Me</>;
    case "joined":
      return <>joined the team</>;
  }
};

const TalentName = ({ label, prefix }: { label: string; prefix: string }) => {
  return (
    <>
      {" "}
      {prefix}{" "}
      <Box component="em" sx={{ fontStyle: "italic" }}>
        {label}
      </Box>
    </>
  );
};

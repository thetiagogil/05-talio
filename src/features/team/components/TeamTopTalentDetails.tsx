import { Box, Typography } from "@mui/material";
import { AvatarBubble } from "@/features/users/components/AvatarBubble";
import type { TeamTopTalent } from "@/features/team/lib/teamInsights";
import type { User } from "@/types/talents";

type TeamTopTalentDetailsProps = {
  currentUserId?: string;
  people: User[];
  topTalent: TeamTopTalent;
};

export const TeamTopTalentDetails = ({
  currentUserId,
  people,
  topTalent,
}: TeamTopTalentDetailsProps) => {
  return (
    <Box sx={{ display: "grid", gap: "0.9rem" }}>
      <Box
        sx={{
          display: "grid",
          gap: "0.2rem",
          borderRadius: "0.625rem",
          p: "0.75rem 0.85rem",
          bgcolor: "var(--surface-2)",
        }}
      >
        <Typography
          component="strong"
          sx={{
            color: "var(--muted-foreground)",
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Brings
        </Typography>
        <Typography
          component="span"
          sx={{ fontSize: "0.8125rem", lineHeight: 1.45 }}
        >
          {topTalent.talent.details.bring}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {people.map((user) => (
          <TeamTopTalentPerson
            isCurrentUser={user.id === currentUserId}
            key={user.id}
            user={user}
          />
        ))}
      </Box>
    </Box>
  );
};

const TeamTopTalentPerson = ({
  isCurrentUser,
  user,
}: {
  isCurrentUser: boolean;
  user: User;
}) => {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        borderRadius: 999,
        px: "0.55rem",
        py: "0.25rem",
        bgcolor: "var(--muted)",
        fontSize: "0.75rem",
      }}
    >
      <AvatarBubble value={user.avatar} size={24} />
      <strong>{user.name}</strong>
      <Box component="small" sx={{ color: "var(--muted-foreground)" }}>
        {user.role}
      </Box>
      {isCurrentUser && (
        <Box
          component="em"
          sx={{
            borderRadius: 999,
            px: "0.4rem",
            py: "0.1rem",
            color: "var(--primary)",
            bgcolor: "color-mix(in oklch, var(--primary) 15%, transparent)",
            fontSize: "0.625rem",
            fontStyle: "normal",
            fontWeight: 800,
          }}
        >
          me
        </Box>
      )}
    </Box>
  );
};

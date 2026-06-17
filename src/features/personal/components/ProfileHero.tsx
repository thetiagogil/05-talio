import { EditRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { AvatarBubble } from "@/features/users/components/AvatarBubble";
import type { Domain, User } from "@/types/talents";

type ProfileHeroProps = {
  dominantDomain: Domain | null;
  kudosCount: number;
  leadingTalentLabel: string | null;
  user: User;
  onEdit: () => void;
};

export const ProfileHero = ({
  dominantDomain,
  kudosCount,
  leadingTalentLabel,
  user,
  onEdit,
}: ProfileHeroProps) => {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "auto 1fr auto" },
        alignItems: "center",
        gap: "2rem",
        overflow: "hidden",
        border: "1px solid var(--border)",
        borderRadius: "1rem",
        p: { xs: "2rem 1.25rem", sm: "2rem" },
        color: "var(--foreground)",
        bgcolor: "var(--surface)",
        background:
          "linear-gradient(135deg, var(--surface) 0, var(--accent) 56%, color-mix(in srgb, var(--domain-strategic-soft) 55%, var(--surface)) 100%)",
        textAlign: { xs: "center", md: "left" },
      }}
    >
      <Box
        component="button"
        aria-label="Change avatar"
        type="button"
        onClick={onEdit}
        sx={{
          position: "relative",
          justifySelf: { xs: "center", md: "auto" },
          border: 0,
          bgcolor: "transparent",
          cursor: "pointer",
          p: 0,
          "&:focus-visible": {
            outline:
              "3px solid color-mix(in oklch, var(--primary) 28%, transparent)",
            outlineOffset: "4px",
            borderRadius: 999,
          },
        }}
      >
        <AvatarBubble value={user.avatar} size={128} />
        <Box
          component="span"
          sx={{
            position: "absolute",
            right: 0,
            bottom: 0,
            display: "grid",
            width: "2rem",
            height: "2rem",
            placeItems: "center",
            border: "1px solid var(--border)",
            borderRadius: 999,
            color: "var(--foreground)",
            bgcolor: "var(--surface)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <EditRounded fontSize="small" />
        </Box>
      </Box>

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          sx={{
            color: "var(--muted-foreground)",
            fontSize: "0.75rem",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {user.role ?? "Team member"}
        </Typography>
        <Typography
          component="h2"
          sx={{
            mt: "0.5rem",
            fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
            fontSize: "clamp(2.2rem, 5vw, 3rem)",
            fontWeight: 500,
            lineHeight: 1,
          }}
        >
          {user.name}
        </Typography>
        <Typography
          component="span"
          sx={{
            display: "block",
            maxWidth: "28rem",
            mt: "0.75rem",
            color: "var(--muted-foreground)",
            lineHeight: 1.6,
          }}
        >
          <ProfileSummary
            dominantDomain={dominantDomain}
            leadingTalentLabel={leadingTalentLabel}
          />
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          width: { xs: "100%", md: "auto" },
          gap: "0.75rem",
          justifyContent: "flex-end",
          textAlign: "center",
        }}
      >
        <ProfileStat value={kudosCount} label="kudos" />
      </Box>
    </Box>
  );
};

function ProfileSummary({
  dominantDomain,
  leadingTalentLabel,
}: {
  dominantDomain: Domain | null;
  leadingTalentLabel: string | null;
}) {
  if (!leadingTalentLabel) {
    return <>Add your talents to unlock a stronger profile summary.</>;
  }

  return (
    <>
      You lead with{" "}
      <Box component="strong" sx={{ fontStyle: "italic" }}>
        {leadingTalentLabel}
      </Box>
      {dominantDomain ? (
        <>
          {" "}
          and most of your strengths fall under{" "}
          <strong>{dominantDomain}</strong>.
        </>
      ) : (
        <>.</>
      )}
    </>
  );
}

function ProfileStat({ value, label }: { value: number; label: string }) {
  return (
    <Box
      sx={{
        minWidth: "6.5rem",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        px: { xs: "0.5rem", sm: "1rem" },
        py: "0.8rem",
        bgcolor: "var(--surface)",
      }}
    >
      <Typography
        component="strong"
        sx={{
          display: "block",
          fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
          fontSize: { xs: "1.5rem", sm: "1.85rem" },
          fontWeight: 600,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
      <Typography
        component="span"
        sx={{
          display: "block",
          mt: "0.25rem",
          color: "var(--muted-foreground)",
          fontSize: "0.625rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

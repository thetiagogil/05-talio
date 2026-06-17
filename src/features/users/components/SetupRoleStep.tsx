import CheckRounded from "@mui/icons-material/CheckRounded";
import { Box } from "@mui/material";
import { ROLES } from "@/features/talents/constants";
import type { RoleName } from "@/types/talents";

type SetupRoleStepProps = {
  role: RoleName | null;
  onRoleChange: (role: RoleName) => void;
};

export const SetupRoleStep = ({ role, onRoleChange }: SetupRoleStepProps) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
        gap: "0.75rem",
      }}
    >
      {ROLES.map((option) => (
        <SetupRoleOption
          active={role === option}
          key={option}
          onClick={() => onRoleChange(option)}
          role={option}
        />
      ))}
    </Box>
  );
};

const SetupRoleOption = ({
  active,
  onClick,
  role,
}: {
  active: boolean;
  onClick: () => void;
  role: RoleName;
}) => {
  return (
    <Box
      component="button"
      aria-pressed={active}
      type="button"
      onClick={onClick}
      sx={{
        position: "relative",
        display: "grid",
        minHeight: "9rem",
        placeItems: "center",
        gap: "0.5rem",
        border: "2px solid",
        borderColor: active ? "var(--primary)" : "var(--border)",
        borderRadius: "0.75rem",
        p: "1.25rem",
        color: "var(--foreground)",
        bgcolor: active
          ? "color-mix(in oklch, var(--primary) 5%, var(--card))"
          : "var(--card)",
        boxShadow: active
          ? "0 0 0 4px color-mix(in oklch, var(--primary) 15%, transparent)"
          : "none",
        cursor: "pointer",
        transition:
          "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "var(--shadow-card)",
        },
        "&:focus-visible": {
          outline:
            "3px solid color-mix(in oklch, var(--primary) 28%, transparent)",
          outlineOffset: "3px",
        },
      }}
    >
      <Box
        component="span"
        sx={{
          display: "grid",
          width: "3rem",
          height: "3rem",
          placeItems: "center",
          borderRadius: "0.75rem",
          color: active ? "var(--primary-foreground)" : "inherit",
          bgcolor: active ? "var(--primary)" : "var(--muted)",
          fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
          fontSize: "1.125rem",
          fontWeight: 800,
        }}
      >
        {role[0]}
      </Box>
      <strong>{role}</strong>
      {active && (
        <CheckRounded
          sx={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            width: "1.25rem",
            height: "1.25rem",
            borderRadius: 999,
            color: "var(--primary-foreground)",
            bgcolor: "var(--primary)",
            fontSize: "0.75rem",
          }}
        />
      )}
    </Box>
  );
};

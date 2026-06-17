import { useState } from "react";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import { Box, Card, Collapse, Typography } from "@mui/material";
import type { Talent } from "@/types/talents";
import { domainStyle } from "@/shared/utils/style-utils";

type TalentRowProps = {
  rank: number;
  talent: Talent;
  defaultOpen?: boolean;
};

export const TalentRow = ({ rank, talent, defaultOpen }: TalentRowProps) => {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const style = domainStyle(talent.category);

  return (
    <Card
      sx={{
        overflow: "hidden",
        boxShadow: open ? "var(--shadow-card)" : "none",
        transition: "box-shadow 160ms ease",
      }}
    >
      <Box
        component="button"
        type="button"
        onClick={() => setOpen((current) => !current)}
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          gap: "1rem",
          border: 0,
          p: "1rem",
          color: "var(--foreground)",
          bgcolor: "transparent",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <Box
          component="span"
          sx={{
            display: "grid",
            width: "2.5rem",
            height: "2.5rem",
            flex: "none",
            placeItems: "center",
            borderRadius: "0.75rem",
            color: "var(--muted-foreground)",
            bgcolor: "var(--muted)",
            fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
            fontWeight: 800,
          }}
        >
          {rank}
        </Box>
        <Box
          component="span"
          sx={{ display: "grid", minWidth: 0, flex: 1, gap: "0.2rem" }}
        >
          <Box
            component="span"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
              fontWeight: 700,
            }}
          >
            <Box
              component="span"
              sx={{
                width: "0.625rem",
                height: "0.625rem",
                flex: "none",
                borderRadius: 999,
                bgcolor: style.base,
              }}
            />
            <span>{talent.label}</span>
          </Box>
          <Box
            component="span"
            sx={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}
          >
            {talent.category}
          </Box>
        </Box>
        <KeyboardArrowDownRounded
          sx={{
            color: "var(--muted-foreground)",
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 160ms ease",
          }}
        />
      </Box>

      <Collapse in={open} unmountOnExit>
        <Box
          sx={{
            borderTop: "1px solid var(--border)",
            p: "1rem 1rem 1.25rem",
            color: "color-mix(in oklch, var(--foreground) 82%, transparent)",
            fontSize: "0.875rem",
            lineHeight: 1.7,
          }}
        >
          <Typography sx={{ fontSize: "0.875rem", lineHeight: 1.7 }}>
            {talent.description}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: "0.75rem",
              mt: "1rem",
            }}
          >
            <TalentDetail label="Brings" value={talent.details.bring} />
            <TalentDetail label="Needs" value={talent.details.need} />
            <TalentDetail
              label="Motivated by"
              value={talent.details.motivate}
            />
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
};

const TalentDetail = ({ label, value }: { label: string; value: string }) => {
  return (
    <Box
      sx={{
        borderRadius: "0.75rem",
        p: "0.75rem",
        bgcolor: "color-mix(in oklch, var(--muted) 50%, transparent)",
      }}
    >
      <Typography
        sx={{
          color: "var(--muted-foreground)",
          fontSize: "0.625rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Box component="span" sx={{ display: "block", mt: "0.25rem" }}>
        {value}
      </Box>
    </Box>
  );
};

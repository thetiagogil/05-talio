import { Box } from "@mui/material";
import type { Domain } from "../../types/talents";
import { domainStyle } from "../../lib/utils/styleUtils";

type DomainTagProps = {
  domain: Domain;
  label?: string;
  compact?: boolean;
};

export function DomainTag({ domain, label = domain, compact }: DomainTagProps) {
  const style = domainStyle(domain);

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        borderRadius: 999,
        px: compact ? "0.5rem" : "0.55rem",
        py: compact ? "0.18rem" : "0.2rem",
        color: style.text,
        bgcolor: style.soft,
        fontSize: compact ? "0.68rem" : "0.7rem",
        fontWeight: 700,
      }}
    >
      <Box
        component="span"
        sx={{
          display: "inline-block",
          width: "0.625rem",
          height: "0.625rem",
          flex: "none",
          borderRadius: 999,
          bgcolor: style.base,
        }}
      />
      {label}
    </Box>
  );
}

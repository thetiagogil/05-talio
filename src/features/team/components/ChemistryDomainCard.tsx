import { Card, Typography } from "@mui/material";
import { domainStyle } from "@/shared/utils/style-utils";
import type { Domain } from "@/types/talents";

type ChemistryDomainCardProps = {
  eyebrow: string;
  text: string;
  title: Domain;
};

export const ChemistryDomainCard = ({
  eyebrow,
  text,
  title,
}: ChemistryDomainCardProps) => {
  const style = domainStyle(title);

  return (
    <Card
      sx={{
        p: "1.5rem",
        borderRadius: "0.875rem",
        bgcolor: style.soft,
        boxShadow: "none",
      }}
    >
      <Typography
        sx={{
          color: "var(--accent2)",
          fontSize: "0.75rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {eyebrow}
      </Typography>
      <Typography
        component="h3"
        sx={{
          mt: "0.5rem",
          color: style.text,
          fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
          fontSize: "2rem",
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
      <Typography
        component="span"
        sx={{ display: "block", mt: "0.5rem", lineHeight: 1.55 }}
      >
        {text}
      </Typography>
    </Card>
  );
};

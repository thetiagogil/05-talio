import { Box, Typography } from "@mui/material";

const strengthLabels = [
  "Executing",
  "Influencing",
  "Relationships",
  "Strategy",
] as const;

export const LoginBrandPanel = () => (
  <Box
    component="aside"
    sx={{
      position: "relative",
      display: "flex",
      minHeight: { xs: "38rem", sm: "44rem", md: "100vh" },
      flexDirection: "column",
      justifyContent: "space-between",
      overflow: "hidden",
      p: { xs: "2rem", md: "3.5rem" },
      color: "var(--foreground)",
      background:
        "linear-gradient(135deg, var(--surface) 0, var(--accent) 52%, color-mix(in srgb, var(--domain-strategic-soft) 55%, var(--surface)) 100%)",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <Box
        component="img"
        src="/favicon.svg"
        alt="Talio"
        sx={{
          display: "block",
          width: "2.25rem",
          height: "2.25rem",
          borderRadius: 999,
        }}
      />
      <Typography
        component="strong"
        sx={{
          fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
          fontWeight: 700,
        }}
      >
        Talio
      </Typography>
    </Box>

    <Box component="section" sx={{ maxWidth: "35rem" }}>
      <Typography
        component="h1"
        sx={{
          maxWidth: "42rem",
          fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
          fontSize: "clamp(2.4rem, 5vw, 4rem)",
          fontWeight: 800,
          lineHeight: 1.04,
        }}
      >
        Know your strengths.
        <br />
        Grow with your team.
      </Typography>
      <Typography
        sx={{
          maxWidth: "27rem",
          mt: "1.25rem",
          color: "var(--muted-foreground)",
          fontSize: "1.125rem",
          lineHeight: 1.65,
        }}
      >
        Discover what makes you tick, share how you work best, and find common
        ground with the people around you.
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          mt: "2.5rem",
        }}
      >
        {strengthLabels.map((label) => (
          <Box
            component="span"
            key={label}
            sx={{
              borderRadius: 999,
              px: "0.9rem",
              py: "0.45rem",
              bgcolor: "var(--surface)",
              boxShadow: "0 0 0 1px var(--border)",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            {label}
          </Box>
        ))}
      </Box>
    </Box>

    <Typography sx={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}>
      &copy; Talio &middot; People team app
    </Typography>
  </Box>
);

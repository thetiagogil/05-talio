import { Box, CircularProgress } from "@mui/material";
import { Suspense, type ReactNode } from "react";

interface RouteSuspenseProps {
  children: ReactNode;
}

const routeFallback = (
  <Box
    sx={{
      display: "grid",
      minHeight: "100vh",
      placeItems: "center",
      bgcolor: "var(--background)",
    }}
  >
    <CircularProgress aria-label="Loading page" size={28} thickness={4} />
  </Box>
);

export const RouteSuspense = ({ children }: RouteSuspenseProps) => (
  <Suspense fallback={routeFallback}>{children}</Suspense>
);

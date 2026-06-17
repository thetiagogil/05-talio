import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo, type ReactNode } from "react";
import { createTalioTheme } from "@/theme/mui-theme";
import { useAppTheme } from "@/theme/theme-storage";

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => {
  const appTheme = useAppTheme();
  const theme = useMemo(() => createTalioTheme(appTheme), [appTheme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

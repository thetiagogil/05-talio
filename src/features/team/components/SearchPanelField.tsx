import { CloseRounded, SearchRounded } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from "@mui/material";

type SearchPanelFieldProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

export const SearchPanelField = ({
  query,
  onQueryChange,
}: SearchPanelFieldProps) => (
  <TextField
    fullWidth
    label="Search teammates"
    placeholder="Search teammates"
    value={query}
    onChange={(event) => onQueryChange(event.target.value)}
    slotProps={{
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <SearchRounded fontSize="small" />
          </InputAdornment>
        ),
        endAdornment: query ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="Clear teammate search"
              size="small"
              onClick={() => onQueryChange("")}
            >
              <CloseRounded fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      } satisfies NonNullable<TextFieldProps["slotProps"]>["input"],
    }}
  />
);

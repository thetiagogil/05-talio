import { useState } from "react";
import { CheckRounded, CloseRounded, EditRounded } from "@mui/icons-material";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { updateManual } from "@/features/users/hooks/useUsers";
import type { Manual } from "@/types/talents";

const prompts: {
  key: keyof Manual;
  question: string;
  placeholder: string;
}[] = [
  {
    key: "about",
    question: "The basics you should know about me are...",
    placeholder: "How I think, when I do my best work...",
  },
  {
    key: "needs",
    question: "I need...",
    placeholder: "Context, autonomy, deep-work blocks...",
  },
  {
    key: "feedback",
    question: "The best way to give me feedback is...",
    placeholder: "Direct and specific, async, in 1:1s...",
  },
  {
    key: "happiness",
    question: "My talents will be happy when...",
    placeholder: "I'm shaping ambiguous problems...",
  },
  {
    key: "passions",
    question: "Beyond work, I'm really passionate about...",
    placeholder: "Music, hiking, painting...",
  },
];

type ManualEditorProps = {
  readOnly?: boolean;
  manual?: Manual;
};

export const ManualEditor = ({
  readOnly = false,
  manual: manualProp,
}: ManualEditorProps) => {
  const currentUser = useCurrentUser();
  const manual = manualProp ?? currentUser?.manual;

  if (!manual) return null;

  return (
    <Box sx={{ display: "grid", gap: "1.5rem" }}>
      {prompts.map((prompt) => (
        <ManualCard
          key={prompt.key}
          field={prompt.key}
          question={prompt.question}
          placeholder={prompt.placeholder}
          readOnly={readOnly}
          value={manual[prompt.key]}
        />
      ))}
    </Box>
  );
};

function ManualCard({
  field,
  question,
  placeholder,
  readOnly,
  value,
}: {
  field: keyof Manual;
  question: string;
  placeholder: string;
  readOnly: boolean;
  value: string;
}) {
  const currentUser = useCurrentUser();
  const [editing, setEditing] = useState(!value && !readOnly);
  const [draft, setDraft] = useState(value);
  const empty = !value.trim();
  const dirty = draft !== value;

  function save() {
    if (!currentUser || !dirty) return;
    updateManual(currentUser.id, { [field]: draft.trim() });
    setEditing(false);
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  return (
    <Card
      sx={{
        p: "1.25rem",
        boxShadow: editing ? "var(--shadow-card)" : "none",
        outline: editing
          ? "1px solid color-mix(in oklch, var(--primary) 20%, transparent)"
          : "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <Typography
          component="h3"
          sx={{ color: "var(--foreground)", fontSize: "1rem", fontWeight: 800 }}
        >
          {question}
        </Typography>
        {!readOnly && !editing && (
          <Button
            size="small"
            startIcon={<EditRounded />}
            variant="text"
            onClick={() => {
              setDraft(value);
              setEditing(true);
            }}
          >
            {empty ? "Add" : "Edit"}
          </Button>
        )}
      </Box>

      {editing ? (
        <Box sx={{ display: "grid", gap: "0.75rem", mt: "0.75rem" }}>
          <TextField
            autoFocus
            multiline
            aria-label={question}
            minRows={4}
            rows={4}
            placeholder={placeholder}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}
          >
            <Button
              startIcon={<CloseRounded />}
              variant="text"
              onClick={cancel}
            >
              Cancel
            </Button>
            <Button
              startIcon={<CheckRounded />}
              disabled={!dirty}
              variant="contained"
              onClick={save}
            >
              Save
            </Button>
          </Box>
        </Box>
      ) : (
        <Typography
          sx={{
            mt: "0.75rem",
            color: empty
              ? "var(--muted-foreground)"
              : "color-mix(in oklch, var(--foreground) 88%, transparent)",
            fontSize: "0.875rem",
            fontStyle: empty ? "italic" : "normal",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}
        >
          {value || (readOnly ? "No answer yet." : placeholder)}
        </Typography>
      )}
    </Card>
  );
}

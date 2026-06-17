import {
  ArrowBackRounded,
  ArrowForwardRounded,
  CheckRounded,
} from "@mui/icons-material";
import { Box, Button } from "@mui/material";

type SetupFlowFooterProps = {
  canContinue: boolean;
  canSubmit: boolean;
  step: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

export const SetupFlowFooter = ({
  canContinue,
  canSubmit,
  step,
  onBack,
  onNext,
  onSubmit,
}: SetupFlowFooterProps) => {
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mt: "2.5rem",
      }}
    >
      <Button
        disabled={step === 0}
        startIcon={<ArrowBackRounded />}
        variant="text"
        onClick={onBack}
      >
        Back
      </Button>

      {step === 0 ? (
        <Button
          disabled={!canContinue}
          endIcon={<ArrowForwardRounded />}
          size="large"
          variant="contained"
          onClick={onNext}
        >
          Next
        </Button>
      ) : (
        <Button
          disabled={!canSubmit}
          endIcon={<CheckRounded />}
          size="large"
          variant="contained"
          onClick={onSubmit}
        >
          Finish setup
        </Button>
      )}
    </Box>
  );
};

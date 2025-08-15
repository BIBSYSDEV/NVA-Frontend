import styled from '@emotion/styled';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import CheckIcon from '@mui/icons-material/Check';
import RestoreIcon from '@mui/icons-material/Restore';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Button, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';

interface CompareFieldsProps {
  sourceContent: ReactNode;
  targetContent: ReactNode;
  isMatching: boolean;
  onCopyValue: () => void;
  onResetValue: () => void;
}

const StyledBox = styled(Box)({
  padding: '0.1rem 0.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
});

export const CompareFields = ({
  sourceContent,
  targetContent,
  isMatching,
  onCopyValue,
  onResetValue,
}: CompareFieldsProps) => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <>
      {sourceContent}

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        {isMatching ? (
          <>
            <StyledBox sx={{ bgcolor: 'secondary.dark' }}>
              <CheckIcon fontSize="small" />
              <Typography>Matcher</Typography>
            </StyledBox>

            {isCopied && (
              <Button
                variant="outlined"
                size="small"
                endIcon={<RestoreIcon />}
                onClick={() => {
                  onResetValue();
                  setIsCopied(false);
                }}>
                Nullstill
              </Button>
            )}
          </>
        ) : (
          <>
            <StyledBox sx={{ bgcolor: 'primary.light' }}>
              <WarningAmberIcon fontSize="small" sx={{ color: 'white' }} />
              <Typography sx={{ color: 'white' }}>Matcher ikke</Typography>
            </StyledBox>

            <Button
              variant="contained"
              size="small"
              endIcon={<ArrowForwardIcon />}
              onClick={() => {
                onCopyValue();
                setIsCopied(true);
              }}>
              Legg til felt
            </Button>
          </>
        )}
      </Box>

      {targetContent}
    </>
  );
};

import styled from '@emotion/styled';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import CheckIcon from '@mui/icons-material/Check';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Button, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface CompareFieldsProps {
  sourceContent: ReactNode;
  targetContent: ReactNode;
  isMatching: boolean;
  onCopyValue: () => void;
}

const StyledBox = styled(Box)({
  padding: '0.1rem 0.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
});

export const CompareFields = ({ sourceContent, targetContent, isMatching, onCopyValue }: CompareFieldsProps) => {
  return (
    <>
      {sourceContent}

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        {isMatching ? (
          <StyledBox sx={{ bgcolor: 'secondary.dark' }}>
            <CheckIcon fontSize="small" />
            <Typography>Matcher</Typography>
          </StyledBox>
        ) : (
          <>
            <StyledBox sx={{ bgcolor: 'primary.light' }}>
              <WarningAmberIcon fontSize="small" sx={{ color: 'white' }} />
              <Typography sx={{ color: 'white' }}>Matcher ikke</Typography>
            </StyledBox>

            <Button variant="contained" size="small" endIcon={<ArrowForwardIcon />} onClick={onCopyValue}>
              Legg til felt
            </Button>
          </>
        )}
      </Box>

      {targetContent}
    </>
  );
};

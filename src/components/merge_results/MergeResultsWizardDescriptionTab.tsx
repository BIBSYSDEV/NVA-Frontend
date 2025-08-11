import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import CheckIcon from '@mui/icons-material/Check';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Button, styled, TextField, Typography } from '@mui/material';
import { ReactNode, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BackgroundDiv } from '../styled/Wrappers';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';

export const MergeResultsWizardDescriptionTab = () => {
  const { t } = useTranslation();
  const { sourceResult, targetResult } = useContext(MergeResultsWizardContext);

  return (
    <BackgroundDiv
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: '1rem',
        mt: '2rem',
        alignItems: 'center',
      }}>
      <Typography variant="h3">Importkandidat</Typography>
      <span />
      <Typography variant="h3">Publisert resultat</Typography>

      <CompareFields
        sourceComponent={
          <TextField
            variant="filled"
            label={t('common.title')}
            multiline
            value={sourceResult.entityDescription?.mainTitle}
            disabled
          />
        }
        targetComponent={
          <TextField
            variant="filled"
            label={t('common.title')}
            multiline
            value={targetResult.entityDescription?.mainTitle}
          />
        }
        isMatching={sourceResult.entityDescription?.mainTitle !== targetResult.entityDescription?.mainTitle}
      />
    </BackgroundDiv>
  );
};

interface CompareFieldsProps {
  sourceComponent: ReactNode;
  targetComponent: ReactNode;
  isMatching: boolean;
}

const StyledBox = styled(Box)({
  padding: '0.1rem 0.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
});

export const CompareFields = ({ sourceComponent, targetComponent, isMatching }: CompareFieldsProps) => {
  return (
    <>
      {sourceComponent}

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

            <Button variant="contained" size="small" endIcon={<ArrowForwardIcon />}>
              Legg til felt
            </Button>
          </>
        )}
      </Box>

      {targetComponent}
    </>
  );
};

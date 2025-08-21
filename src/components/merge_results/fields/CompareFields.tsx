import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import CheckIcon from '@mui/icons-material/Check';
import RestoreIcon from '@mui/icons-material/Restore';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Button, Divider, styled, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';

interface CompareFieldsProps {
  sourceContent: ReactNode;
  targetContent: ReactNode;
  isMatching: boolean;
  isChanged: boolean;
  onCopyValue?: () => void;
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
  isChanged,
  onCopyValue,
  onResetValue,
}: CompareFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      {sourceContent}

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        {isMatching ? (
          <StyledBox sx={{ bgcolor: 'secondary.dark' }}>
            <CheckIcon fontSize="small" />
            <Typography>{t('matches')}</Typography>
          </StyledBox>
        ) : (
          <>
            <StyledBox sx={{ bgcolor: 'primary.light' }}>
              <WarningAmberIcon fontSize="small" sx={{ color: 'white' }} />
              <Typography sx={{ color: 'white' }}>{t('does_not_match')}</Typography>
            </StyledBox>

            {onCopyValue && (
              <Button
                data-testid={dataTestId.basicData.centralImport.copyValueButton}
                variant="contained"
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={onCopyValue}>
                {t('overwrite')}
              </Button>
            )}
          </>
        )}

        {isChanged && (
          <Button
            data-testid={dataTestId.basicData.centralImport.resetValueButton}
            variant="outlined"
            size="small"
            endIcon={<RestoreIcon />}
            onClick={onResetValue}>
            {t('reset')}
          </Button>
        )}
      </Box>

      {targetContent}

      <Divider sx={{ gridColumn: '1/-1', my: '0.5rem' }} />
    </>
  );
};

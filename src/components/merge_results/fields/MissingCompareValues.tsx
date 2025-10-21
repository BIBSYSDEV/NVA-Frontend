import { Box, Divider, styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const StyledValueBox = styled(Box)({
  padding: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '0.25rem',
  background: 'white',
  height: '100%',
  minHeight: '4rem',
});

export const MissingCompareValues = () => {
  const { t } = useTranslation();

  return (
    <>
      <StyledValueBox>
        <Typography fontStyle="italic">{t('missing_value')}</Typography>
      </StyledValueBox>
      <StyledValueBox sx={{ display: { xs: 'none', md: 'flex' }, gridColumn: 3 }}>
        <Typography fontStyle="italic">{t('missing_value')}</Typography>
      </StyledValueBox>
      <Divider sx={{ display: { xs: 'block', md: 'none' }, my: '0.5rem' }} />
    </>
  );
};

import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ReferenceContentProps {
  citation: string;
  isLoading: boolean;
  isError: boolean;
}

export const ReferenceContent = ({ citation, isLoading, isError }: ReferenceContentProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <CircularProgress size="1rem" aria-hidden />
        <Typography>{t('fetching_reference')}</Typography>
      </Box>
    );
  }

  if (isError) {
    return <Typography>{t('feedback.error.get_reference')}</Typography>;
  }

  return <Typography>{citation}</Typography>;
};

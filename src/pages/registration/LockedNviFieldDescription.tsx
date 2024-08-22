import ErrorIcon from '@mui/icons-material/Error';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface LockedNviFieldDescriptionProps {
  fieldLabel: string;
}

export const LockedNviFieldDescription = ({ fieldLabel }: LockedNviFieldDescriptionProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', mb: '0.25rem' }}>
        <ErrorIcon />
        <Typography variant="h2" color="inherit">
          {t('common.nvi')}
        </Typography>
      </Box>
      <Typography color="inherit">{t('registration.locked_nvi_field_description', { field: fieldLabel })}</Typography>
    </>
  );
};

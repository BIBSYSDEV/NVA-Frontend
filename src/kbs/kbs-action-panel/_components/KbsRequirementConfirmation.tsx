import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const KbsRequirementConfirmation = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <CheckBoxIcon color="secondary" aria-hidden="true" />
      <Typography>{t('kbs_requirement_confirmed')}</Typography>
    </Box>
  );
};

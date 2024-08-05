import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const StartEmptyProject = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="h2">{t('project.form.empty_registration')}</Typography>
      <Typography>{t('project.form.start_with_empty_form')}</Typography>
    </Box>
  );
};

export default StartEmptyProject;

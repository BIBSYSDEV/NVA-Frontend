import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { RelatedProjectsField } from './RelatedProjectsField';
import { FormBox } from './styles';

export const ProjectConnectionsForm = () => {
  const { t } = useTranslation();
  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormBox>
          <Typography variant="h2">{t('project.form.related_projects')}</Typography>
          <Typography>{t('project.form.related_projects_description')}</Typography>
          <RelatedProjectsField />
        </FormBox>
      </Box>
    </ErrorBoundary>
  );
};

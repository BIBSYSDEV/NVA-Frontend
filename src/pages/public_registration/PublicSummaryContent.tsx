import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';

export const PublicSummaryContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation();

  const { entityDescription } = registration;

  return !entityDescription ? null : (
    <>
      {entityDescription.abstract && (
        <Typography style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }} sx={{ mb: '1rem' }}>
          {entityDescription.abstract}
        </Typography>
      )}
      {entityDescription.alternativeAbstracts.und && (
        <>
          <Typography variant="h3" color="primary" gutterBottom>
            {t('registration.description.alternative_abstract')}
          </Typography>
          <Typography style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }} sx={{ mb: '1rem' }}>
            {entityDescription.alternativeAbstracts.und}
          </Typography>
        </>
      )}
      {entityDescription.description && (
        <>
          <Typography variant="h3" color="primary" gutterBottom>
            {t('registration.description.description_of_content')}
          </Typography>
          <Typography style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }} sx={{ mb: '1rem' }}>
            {entityDescription.description}
          </Typography>
        </>
      )}
    </>
  );
};

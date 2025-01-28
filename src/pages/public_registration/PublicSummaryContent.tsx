import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';

export const PublicSummaryContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation();

  const { entityDescription } = registration;

  return !entityDescription ? null : (
    <>
      {entityDescription.abstract && (
        <>
          <Typography fontWeight="bold" sx={{ textDecoration: 'underline' }}>
            Lexical safe:
          </Typography>
          <Typography style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }} sx={{ mb: '1rem' }}>
            {entityDescription.abstract}
          </Typography>
          <Typography fontWeight="bold" sx={{ textDecoration: 'underline' }}>
            Lexical danger:
          </Typography>
          <Typography
            style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}
            sx={{ mb: '1rem' }}
            dangerouslySetInnerHTML={{ __html: entityDescription.abstract }}
          />
        </>
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
          <Typography fontWeight="bold" sx={{ textDecoration: 'underline' }}>
            TipTap safe:
          </Typography>
          <Typography style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }} sx={{ mb: '1rem' }}>
            {entityDescription.description}
          </Typography>
          <Typography fontWeight="bold" sx={{ textDecoration: 'underline' }}>
            TipTap danger:
          </Typography>
          <Typography
            style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}
            sx={{ mb: '1rem' }}
            dangerouslySetInnerHTML={{ __html: entityDescription.description }}
          />
        </>
      )}
    </>
  );
};

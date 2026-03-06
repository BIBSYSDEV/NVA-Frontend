import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Fragment } from 'react/jsx-runtime';
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

      {Object.entries(entityDescription.alternativeAbstracts).map(([languageKey, abstract]) => {
        return (
          <Fragment key={languageKey}>
            <Typography variant="h3" color="primary" gutterBottom>
              {t('registration.description.alternative_abstract')}
            </Typography>
            <Typography style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }} sx={{ mb: '1rem' }}>
              {abstract}
            </Typography>
          </Fragment>
        );
      })}

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

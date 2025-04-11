import { Typography } from '@mui/material';
import { getLanguageByIso6391Code, getLanguageByIso6392Code, getLanguageByIso6393Code } from 'nva-language';
import { useTranslation } from 'react-i18next';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';

export const PublicSummaryContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t, i18n } = useTranslation();

  const { entityDescription } = registration;

  return !entityDescription ? null : (
    <>
      {entityDescription.abstract && (
        <Typography style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }} sx={{ mb: '1rem' }}>
          {entityDescription.abstract}
        </Typography>
      )}

      {Object.entries(entityDescription.alternativeAbstracts).map(([languageKey, abstract]) => {
        const languageObject =
          languageKey === 'und'
            ? null
            : getLanguageByIso6391Code(languageKey) ||
              getLanguageByIso6392Code(languageKey) ||
              getLanguageByIso6393Code(languageKey);

        const translatedLanguage =
          i18n.language === 'nob'
            ? languageObject?.nob.toLowerCase()
            : i18n.language === 'nno'
              ? languageObject?.nno.toLowerCase()
              : languageObject?.eng;

        const heading = translatedLanguage
          ? `${t('registration.description.alternative_abstract')} (${translatedLanguage})`
          : t('registration.description.alternative_abstract');

        return (
          <>
            <Typography variant="h3" color="primary" gutterBottom>
              {heading}
            </Typography>
            <Typography style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }} sx={{ mb: '1rem' }}>
              {abstract}
            </Typography>
          </>
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

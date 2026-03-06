import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LanguageString } from '../../types/common.types';
import { getLanguageString, triggerLanguageRerender } from '../../utils/translation-helpers';

interface ProjectSummaryProps {
  academicSummary: LanguageString;
  popularScienceSummary: LanguageString;
}

export const ProjectSummary = ({ academicSummary, popularScienceSummary }: ProjectSummaryProps) => {
  const { t } = useTranslation();

  return !academicSummary && !popularScienceSummary ? (
    <Typography>{t('project.no_summary')}</Typography>
  ) : (
    <>
      {academicSummary && (
        <>
          <Typography variant="h3">{t('project.scientific_summary')}</Typography>
          <Typography sx={{ mb: '1rem' }}>{triggerLanguageRerender(t, getLanguageString(academicSummary))}</Typography>
        </>
      )}
      {popularScienceSummary && (
        <>
          <Typography variant="h3">{t('project.popular_science_summary')}</Typography>
          <Typography>{triggerLanguageRerender(t, getLanguageString(popularScienceSummary))}</Typography>
        </>
      )}
    </>
  );
};

import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LanguageString } from '../../types/common.types';
import { getLanguageString } from '../../utils/translation-helpers';

interface ProjectSummaryProps {
  academicSummary: LanguageString;
  popularScienceSummary: LanguageString;
}

export const ProjectSummary = ({ academicSummary, popularScienceSummary }: ProjectSummaryProps) => {
  const { t } = useTranslation();

  const academicSummaryString = getLanguageString(academicSummary);
  const popularScienceSummaryString = getLanguageString(popularScienceSummary);

  return !academicSummaryString && !popularScienceSummaryString ? (
    <Typography>{t('project.no_summary')}</Typography>
  ) : (
    <>
      {academicSummaryString && (
        <>
          <Typography variant="h3">{t('project.scientific_summary')}</Typography>
          <Typography sx={{ mb: '1rem' }}>{academicSummaryString}</Typography>
        </>
      )}
      {popularScienceSummaryString && (
        <>
          <Typography variant="h3">{t('project.popular_science_summary')}</Typography>
          <Typography>{popularScienceSummaryString}</Typography>
        </>
      )}
    </>
  );
};

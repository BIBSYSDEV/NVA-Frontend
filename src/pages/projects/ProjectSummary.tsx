import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LanguageString } from '../../types/common.types';
import { getLanguageString } from '../../utils/translation-helpers';

interface ProjectSummaryProps {
  academicSummary: LanguageString;
  popularScienceSummary: LanguageString;
}

export const ProjectSummary = ({ academicSummary, popularScienceSummary }: ProjectSummaryProps) => {
  const { t } = useTranslation('project');

  const academicSummaryString = getLanguageString(academicSummary);
  const popularScienceSummaryString = getLanguageString(popularScienceSummary);
  return (
    <>
      {academicSummaryString && (
        <>
          <Typography variant="h3">{t('scientific_summary')}</Typography>
          <Typography paragraph>{academicSummaryString}</Typography>
        </>
      )}
      {popularScienceSummaryString && (
        <>
          <Typography variant="h3">{t('popular_science_summary')}</Typography>
          <Typography>{popularScienceSummaryString}</Typography>
        </>
      )}
    </>
  );
};

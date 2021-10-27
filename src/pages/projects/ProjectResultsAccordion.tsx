import { CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SearchApiPath } from '../../api/apiPaths';
import { LandingPageAccordion } from '../../components/landing_page/LandingPageAccordion';
import { RegistrationList } from '../../components/RegistrationList';
import { DescriptionFieldNames } from '../../types/publicationFieldNames';
import { SearchResult } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { useFetch } from '../../utils/hooks/useFetch';

interface ProjectResultsProps {
  projectId: string;
}

export const ProjectResultsAccordion = ({ projectId }: ProjectResultsProps) => {
  const { t } = useTranslation('project');
  const [results, isLoadingResults] = useFetch<SearchResult>({
    url: `${SearchApiPath.Registrations}?query=${DescriptionFieldNames.Projects}.id="${projectId}"`,
    errorMessage: t('feedback:error.search'),
  });

  return (
    <LandingPageAccordion
      data-testid={dataTestId.projectLandingPage.resultsAccordion}
      heading={results ? `${t('results')} (${results.total})` : t('results')}>
      {isLoadingResults ? (
        <CircularProgress />
      ) : results && results.total > 0 ? (
        <RegistrationList registrations={results.hits} />
      ) : (
        <Typography>{t('no_results')}</Typography>
      )}
    </LandingPageAccordion>
  );
};

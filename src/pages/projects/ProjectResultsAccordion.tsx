import { CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SearchApiPath } from '../../api/apiPaths';
import { LandingPageAccordion } from '../../components/landing_page/LandingPageAccordion';
import { RegistrationList } from '../../components/RegistrationList';
import { SearchResponse } from '../../types/common.types';
import { DescriptionFieldNames } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { useFetch } from '../../utils/hooks/useFetch';

interface ProjectResultsProps {
  projectId: string;
}

export const ProjectResultsAccordion = ({ projectId }: ProjectResultsProps) => {
  const { t } = useTranslation();
  const [results, isLoadingResults] = useFetch<SearchResponse<Registration>>({
    url: `${SearchApiPath.Registrations}?query=${DescriptionFieldNames.Projects}.id="${projectId}"`,
    errorMessage: t('feedback.error.search'),
  });

  return (
    <LandingPageAccordion
      data-testid={dataTestId.projectLandingPage.resultsAccordion}
      heading={results ? `${t('project.results')} (${results.size})` : t('project.results')}>
      {isLoadingResults ? (
        <CircularProgress />
      ) : results && results.size > 0 ? (
        <RegistrationList registrations={results.hits} />
      ) : (
        <Typography>{t('project.no_results')}</Typography>
      )}
    </LandingPageAccordion>
  );
};

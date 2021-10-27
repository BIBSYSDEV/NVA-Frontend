import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SearchApiPath } from '../../api/apiPaths';
import { RegistrationList } from '../../components/RegistrationList';
import { DescriptionFieldNames } from '../../types/publicationFieldNames';
import { SearchResult } from '../../types/registration.types';
import { useFetch } from '../../utils/hooks/useFetch';

interface ProjectResultsProps {
  projectId: string;
}

export const ProjectResults = ({ projectId }: ProjectResultsProps) => {
  const { t } = useTranslation('project');
  const [results, isLoadingResults] = useFetch<SearchResult>({
    url: `${SearchApiPath.Registrations}?query=${DescriptionFieldNames.Projects}.id="${projectId}"`,
    errorMessage: t('feedback:error.search'),
  });

  return isLoadingResults ? (
    <CircularProgress />
  ) : results && results.total > 0 ? (
    <RegistrationList registrations={results.hits} />
  ) : null;
};

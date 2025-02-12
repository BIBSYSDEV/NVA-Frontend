import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PersonSearchParams, searchForPerson } from '../cristinApi';

export const useSearchForPerson = (searchTerm: string, rowsPerPage = 20, page = 1) => {
  const { t } = useTranslation();

  const personQueryParams: PersonSearchParams = {
    name: searchTerm,
  };

  return useQuery({
    enabled: searchTerm.length > 0,
    queryKey: ['person', rowsPerPage, page, personQueryParams],
    queryFn: () => searchForPerson(rowsPerPage, page, personQueryParams),
    meta: { errorMessage: t('feedback.error.person_search') },
  });
};

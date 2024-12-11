import { useQuery } from '@tanstack/react-query';
import { PersonSearchParams, searchForPerson } from '../cristinApi';

export const useSearchForPerson = (searchTerm: string, rowsPerPage = 20, page = 1, errorMessage = '') => {
  const personQueryParams: PersonSearchParams = {
    name: searchTerm,
  };
  return useQuery({
    enabled: searchTerm.length > 0,
    queryKey: ['person', rowsPerPage, page, personQueryParams],
    queryFn: () => searchForPerson(rowsPerPage, page, personQueryParams),
    meta: { errorMessage: errorMessage },
  });
};

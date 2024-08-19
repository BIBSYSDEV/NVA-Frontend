import { useQuery } from '@tanstack/react-query';
import { PersonSearchParams, searchForPerson } from '../cristinApi';

export const useFetchPerson = (searchTerm: string) => {
  const personQueryParams: PersonSearchParams = {
    name: searchTerm,
  };
  return useQuery({
    enabled: searchTerm.length > 0,
    queryKey: ['person', 20, 1, personQueryParams],
    queryFn: () => searchForPerson(20, 1, personQueryParams),
  });
};

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PersonSearchParams, searchForPerson } from '../cristinApi';

export const useSearchForPerson = (searchParams: PersonSearchParams) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: !!searchParams.name && searchParams.name.length > 0,
    queryKey: ['person', searchParams],
    queryFn: () => searchForPerson(searchParams),
    meta: { errorMessage: t('feedback.error.person_search') },
  });
};

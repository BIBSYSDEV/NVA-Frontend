import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FetchProtectedResultsParams, fetchMyResults } from '../searchApi';
import { SearchParamType } from '../../utils/hooks/useRegistrationSearchParams';

export const myRegistrationsSearchQueryKeyString = 'myRegistrations';

interface MyRegistrationsSearchProps {
  params: FetchProtectedResultsParams;
  queryKey?: (string | SearchParamType)[];
}

export const useMyRegistrationsSearch = ({ params, queryKey }: MyRegistrationsSearchProps) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: queryKey ?? [myRegistrationsSearchQueryKeyString, params],
    queryFn: ({ signal }) => fetchMyResults(params, signal),
    meta: { errorMessage: t('feedback.error.search') },
  });
};

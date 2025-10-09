import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../utils/constants';
import { CristinApiPath } from '../apiPaths';
import { fetchPerson } from '../cristinApi';

export interface UseFetchPersonOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export const useFetchCristinPerson = (cristinId: string, options?: UseFetchPersonOptions) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: options?.enabled !== false && !!cristinId,
    queryKey: ['person', cristinId],
    queryFn: () => fetchPerson(cristinId),
    meta: { errorMessage: t('feedback.error.get_person') },
    staleTime: options?.staleTime,
    gcTime: options?.gcTime,
  });
};

export const useFetchPersonByIdentifier = (identifier: string, options?: UseFetchPersonOptions) => {
  const cristinId = `${API_URL}${CristinApiPath.Person.substring(1)}/${identifier}`;
  return useFetchCristinPerson(cristinId, options);
};

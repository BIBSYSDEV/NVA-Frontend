import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../utils/constants';
import { CristinApiPath } from '../apiPaths';
import { fetchPerson } from '../cristinApi';

interface UseFetchPersonOptions {
  enabled?: boolean;
}

export const useFetchPerson = (cristinId: string, options?: UseFetchPersonOptions) => {
  const { t } = useTranslation();

  return useQuery({
    enabled: options?.enabled && !!cristinId,
    queryKey: ['person', cristinId],
    queryFn: () => (cristinId ? fetchPerson(cristinId) : null),
    meta: { errorMessage: t('feedback.error.get_person') },
  });
};

export const useFetchPersonByIdentifier = (identifier: string, options?: UseFetchPersonOptions) => {
  const cristinId = `${API_URL}${CristinApiPath.Person.substring(1)}/${identifier}`;
  return useFetchPerson(cristinId, options);
};

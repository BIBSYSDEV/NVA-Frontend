import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchNviInstitutionStatus } from '../scientificIndexApi';

export const useFetchNviInstitutionStatus = (year: number) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['nviStatus', year],
    queryFn: () => fetchNviInstitutionStatus(year),
    meta: { errorMessage: t('feedback.error.get_nvi_status') },
  });
};

import { useTranslation } from 'react-i18next';
import { InstitutionApiPaths } from '../../api/apiPaths';
import { RecursiveInstitutionUnit } from '../../types/institution.types';
import { getPreferredLanguageCode } from '../translation-helpers';
import { useFetch } from './useFetch';

export const useFetchDepartment = (departmentId: string) => {
  const { t } = useTranslation('feedback');
  const fetchDepartment = useFetch<RecursiveInstitutionUnit>({
    url: departmentId
      ? `${InstitutionApiPaths.DEPARTMENTS}?uri=${encodeURIComponent(
          departmentId
        )}&language=${getPreferredLanguageCode()}`
      : '',
    errorMessage: t('feedback:error.get_institutions'),
  });

  return fetchDepartment;
};

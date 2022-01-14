import { useTranslation } from 'react-i18next';
import { InstitutionApiPath } from '../../api/apiPaths';
import { RecursiveInstitutionUnit } from '../../types/institution.types';
import { getPreferredLanguageCode } from '../translation-helpers';
import { useFetch } from './useFetch';

export const useFetchDepartment = (departmentId: string) => {
  const { t, i18n } = useTranslation('feedback');
  const fetchDepartment = useFetch<RecursiveInstitutionUnit>({
    url: departmentId
      ? `${InstitutionApiPath.Departments}?uri=${encodeURIComponent(departmentId)}&language=${getPreferredLanguageCode(
          i18n.language
        )}`
      : '',
    errorMessage: t('feedback:error.get_institutions'),
  });

  return fetchDepartment;
};

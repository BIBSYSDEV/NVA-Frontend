import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getDepartment } from '../../api/institutionApi';
import { RecursiveInstitutionUnit } from '../../types/institution.types';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import useCancelToken from './useCancelToken';

const useFetchDepartments = (departmentId: string = ''): [RecursiveInstitutionUnit[], boolean] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const [departments, setDepartments] = useState<RecursiveInstitutionUnit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const cancelToken = useCancelToken();

  const fetchDepartments = useCallback(
    async (unitId?: string) => {
      setDepartments([]);
      if (unitId) {
        setIsLoading(true);
        const response = await getDepartment(unitId, cancelToken);
        if (response) {
          if (response.error) {
            dispatch(setNotification(t('error.get_institutions'), NotificationVariant.Error));
          } else if (response.data) {
            setDepartments(response.data.subunits ?? []);
          }
        }
        setIsLoading(false);
      }
    },
    [dispatch, t, cancelToken]
  );

  useEffect(() => {
    fetchDepartments(departmentId);
  }, [fetchDepartments, departmentId]);

  return [departments, isLoading];
};

export default useFetchDepartments;

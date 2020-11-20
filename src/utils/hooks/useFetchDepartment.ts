import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getDepartment } from '../../api/institutionApi';
import { RecursiveInstitutionUnit } from '../../types/institution.types';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import useCancelToken from './useCancelToken';

const useFetchDepartment = (departmentId: string): [RecursiveInstitutionUnit | undefined, boolean] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const [department, setDepartment] = useState<RecursiveInstitutionUnit>();
  const [isLoading, setIsLoading] = useState(false);
  const cancelToken = useCancelToken();

  const fetchDepartment = useCallback(
    async (unitId: string) => {
      setIsLoading(true);
      const response = await getDepartment(unitId, cancelToken);
      if (response) {
        if (response.error) {
          dispatch(setNotification(t('error.get_institutions'), NotificationVariant.Error));
        } else if (response.data) {
          setDepartment(response.data);
        }
        setIsLoading(false);
      }
    },
    [dispatch, t, cancelToken]
  );

  useEffect(() => {
    if (departmentId) {
      fetchDepartment(departmentId);
    }
  }, [fetchDepartment, departmentId]);

  return [department, isLoading];
};

export default useFetchDepartment;

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Axios from 'axios';
import { useTranslation } from 'react-i18next';
import { RecursiveInstitutionUnit } from '../../types/institution.types';
import { getDepartment } from '../../api/institutionApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';

// This hook is used to fetch the top-down hierarchy of any given sub-unit
const useFetchUnitHierarchy = (unitUri: string): [RecursiveInstitutionUnit | undefined, boolean] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const [isLoading, setIsLoading] = useState(true);
  const [unit, setUnit] = useState<RecursiveInstitutionUnit>();

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchDepartment = async () => {
      const response = await getDepartment(unitUri, cancelSource.token);
      if (response) {
        setIsLoading(false);
        if (response.error) {
          dispatch(setNotification(t('error.get_institution'), NotificationVariant.Error));
        } else if (response.data) {
          if (response.data.subunits && response.data.subunits.length > 1) {
            // Remove subunits from institution, since we only care about top-level in this case
            // NOTE: This means we cannot use this hook to get all subunits
            delete response.data.subunits;
          }
          setUnit(response.data);
        }
      }
    };
    fetchDepartment();

    return () => cancelSource.cancel();
  }, [dispatch, t, unitUri]);

  return [unit, isLoading];
};

export default useFetchUnitHierarchy;

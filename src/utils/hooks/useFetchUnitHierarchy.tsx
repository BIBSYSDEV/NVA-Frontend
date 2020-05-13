import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { RecursiveInstitutionUnit } from '../../types/institution.types';
import { getDepartment } from '../../api/institutionApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { getUnitUri } from '../unitUrl';
import Axios from 'axios';

// This hook is used to fetch the top-down hierarchy of any given sub-unit
const useFetchUnitHierarchy = (unitId: string): [RecursiveInstitutionUnit | undefined, boolean] => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [unit, setUnit] = useState<RecursiveInstitutionUnit | undefined>();

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchDepartment = async () => {
      setIsLoading(true);
      // TODO: NP-844 should ensure we have URIs from start (not IDs)
      const unitUri = getUnitUri(unitId);

      const response = await getDepartment(unitUri, cancelSource.token);
      if (response) {
        setIsLoading(false);
        if (response.error) {
          dispatch(setNotification(response.error, NotificationVariant.Error));
        } else {
          if (response.subunits && response.subunits.length > 1) {
            // Remove subunits from institution, since we only care about top-level in this case
            // NOTE: This means we cannot use this hook to get all subunits
            delete response.subunits;
          }
          setUnit(response);
        }
      }
    };
    fetchDepartment();

    return () => cancelSource.cancel();
  }, [dispatch, unitId]);

  return [unit, isLoading];
};

export default useFetchUnitHierarchy;

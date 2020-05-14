import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { RecursiveInstitutionUnit } from '../../types/institution.types';
import { getDepartment } from '../../api/institutionApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { getUnitUri } from '../unitUrl';
import Axios from 'axios';

// This hook is used to fetch the top-down hierarchy of units given an array of unitIds
const useFetchMultipleUnits = (unitIds: string[] | undefined): [RecursiveInstitutionUnit[] | undefined, boolean] => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [units, setUnits] = useState<RecursiveInstitutionUnit[]>([]);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchDepartment = async (unitId: string) => {
      // TODO: NP-844 should ensure we have URIs from start (not IDs)
      const unitUri = getUnitUri(unitId);

      const response = await getDepartment(unitUri, cancelSource.token);
      if (response) {
        if (response.error) {
          dispatch(setNotification(response.error, NotificationVariant.Error));
        } else {
          return response;
        }
      }
    };
    if (unitIds && unitIds.length > 0) {
      setIsLoading(true);
      unitIds.forEach(async (unitId) => {
        const unit = await fetchDepartment(unitId);
        if (unit) {
          setUnits((u) => {
            if (u.length === unitIds.length - 1) {
              setIsLoading(false);
            }
            return [...u, unit];
          });
        }
      });
    } else {
      setIsLoading(false);
    }

    return () => cancelSource.cancel();
  }, [dispatch, unitIds]);

  return [units, isLoading];
};

export default useFetchMultipleUnits;

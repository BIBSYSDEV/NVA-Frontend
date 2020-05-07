import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { RecursiveInstitutionUnit } from '../../types/institution.types';
import { CRISTIN_UNITS_BASE_URL, CRISTIN_INSTITUTIONS_BASE_URL } from '../constants';
import { getDepartment } from '../../api/institutionApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { isValidUrl } from '../isValidUrl';
import Axios from 'axios';

// This hook is used to fetch the top-down hierarchy of units given an array of unitIds
const useFetchMultipleUnits = (unitIds: string[] | undefined): [RecursiveInstitutionUnit[] | undefined, boolean] => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [units, setUnits] = useState<RecursiveInstitutionUnit[]>([]);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchDepartment = async (unitId: string) => {
      setIsLoading(true);
      // TODO: NP-844 should ensure we have URIs from start (not IDs)
      const unitUri = isValidUrl(unitId)
        ? unitId
        : unitId.includes('.') // Check if root level institution
        ? `${CRISTIN_UNITS_BASE_URL}${unitId}`
        : `${CRISTIN_INSTITUTIONS_BASE_URL}${unitId}`;

      const response = await getDepartment(unitUri, cancelSource.token);
      if (response) {
        setIsLoading(false);
        if (response.error) {
          dispatch(setNotification(response.error, NotificationVariant.Error));
        } else {
          return response;
        }
      }
    };
    if (unitIds) {
      unitIds.forEach(async (unitId) => {
        const unit = await fetchDepartment(unitId);
        if (unit) {
          setUnits((u) => [...u, unit]);
        }
      });
    }

    return () => cancelSource.cancel();
  }, [dispatch, unitIds]);

  return [units, isLoading];
};

export default useFetchMultipleUnits;

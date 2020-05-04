import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { InstitutionUnitBase } from '../../types/institution.types';
import { getInstitutions } from '../../api/institutionApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import Axios from 'axios';
import { RootStore } from '../../redux/reducers/rootReducer';
import { setInstitutions } from '../../redux/actions/institutionActions';

// This hook should only be used when fetching the hierarchy of a given unit and not if it is desired
// to access all subunits of the given unit.
const useFetchInstitutions = (): [InstitutionUnitBase[], boolean] => {
  const dispatch = useDispatch();
  const institutions = useSelector((store: RootStore) => store.institutions);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchInstitutions = async () => {
      setIsLoading(true);
      const response = await getInstitutions();
      if (response?.error) {
        dispatch(setNotification(response.error, NotificationVariant.Error));
      } else {
        dispatch(setInstitutions(response));
      }
      setIsLoading(false);
    };
    // Institutions should not change, so ensure we fetch only once
    if (!institutions || institutions.length === 0) {
      fetchInstitutions();
    }

    return () => cancelSource.cancel();
  }, [dispatch, institutions]);

  return [institutions, isLoading];
};

export default useFetchInstitutions;

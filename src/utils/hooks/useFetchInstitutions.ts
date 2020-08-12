import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Axios from 'axios';

import { InstitutionUnitBase } from '../../types/institution.types';
import { getInstitutions } from '../../api/institutionApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { RootStore } from '../../redux/reducers/rootReducer';
import { setInstitutions } from '../../redux/actions/institutionActions';

// This hook is used to fetch all top-level institutions
const useFetchInstitutions = (): [InstitutionUnitBase[], boolean] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const institutions = useSelector((store: RootStore) => store.institutions);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchInstitutions = async () => {
      const response = await getInstitutions(cancelSource.token);
      if (response.error) {
        dispatch(setNotification(t('error.get_institutions'), NotificationVariant.Error));
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
  }, [t, dispatch, institutions]);

  return [institutions, isLoading];
};

export default useFetchInstitutions;

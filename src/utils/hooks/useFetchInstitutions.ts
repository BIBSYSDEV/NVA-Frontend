import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { InstitutionUnitBase } from '../../types/institution.types';
import { getInstitutions } from '../../api/institutionApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { RootStore } from '../../redux/reducers/rootReducer';
import { setInstitutions } from '../../redux/actions/institutionActions';
import useCancelToken from './useCancelToken';

// This hook is used to fetch all top-level institutions
const useFetchInstitutions = (): [InstitutionUnitBase[], boolean] => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('feedback');
  const institutions = useSelector((store: RootStore) => store.institutions);
  const [isLoading, setIsLoading] = useState(true);
  const cancelToken = useCancelToken();

  const fetchInstitutions = useCallback(async () => {
    const response = await getInstitutions(cancelToken);
    if (response) {
      if (response.error) {
        dispatch(setNotification(t('error.get_institutions'), NotificationVariant.Error));
      } else if (response.data) {
        dispatch(setInstitutions(response.data));
      }
      setIsLoading(false);
    }
  }, [dispatch, t, cancelToken]);

  useEffect(() => {
    // Institutions should not change, so ensure we fetch only once
    if (!institutions || institutions.length === 0) {
      fetchInstitutions();
    }
  }, [fetchInstitutions, institutions]);

  useEffect(() => {
    // Update institutions if user updates language
    fetchInstitutions();
  }, [fetchInstitutions, i18n.language]);

  return [institutions, isLoading];
};

export default useFetchInstitutions;

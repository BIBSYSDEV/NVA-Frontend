import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { CustomerInstitution } from '../../types/customerInstitution.types';
import { getAllCustomerInstitutions } from '../../api/customerInstitutionsApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import useCancelToken from './useCancelToken';

export const useFetchCustomerInstitutions = (): [CustomerInstitution[], boolean] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const cancelToken = useCancelToken();
  const [isLoading, setIsLoading] = useState(true);
  const [customerInstitutions, setCustomerInstitutions] = useState<CustomerInstitution[]>([]);

  useEffect(() => {
    const fetchCustomerInstitution = async () => {
      const fetchedInstitutions = await getAllCustomerInstitutions(cancelToken);
      if (fetchedInstitutions) {
        if (fetchedInstitutions.error) {
          dispatch(setNotification(t('error.get_customers'), NotificationVariant.Error));
        } else if (fetchedInstitutions.data) {
          setCustomerInstitutions(fetchedInstitutions.data.customers);
        }
        setIsLoading(false);
      }
    };

    fetchCustomerInstitution();
  }, [t, dispatch, cancelToken]);

  return [customerInstitutions, isLoading];
};

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { CustomerInstitution } from '../../types/customerInstitution.types';
import { getCustomerInstitution } from '../../api/customerInstitutionsApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import useCancelToken from './useCancelToken';

export const useFetchCustomerInstitution = (
  customerId: string
): [CustomerInstitution | undefined, boolean, (customerInstitution: CustomerInstitution) => void] => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const cancelToken = useCancelToken();
  const [isLoading, setIsLoading] = useState(!!customerId);
  const [customerInstitution, setCustomerInstitution] = useState<CustomerInstitution>();

  const handleSetCustomerInstitution = (customerInstitution: CustomerInstitution) => {
    setCustomerInstitution(customerInstitution);
  };

  useEffect(() => {
    const fetchCustomerInstitution = async () => {
      const institution = await getCustomerInstitution(customerId, cancelToken);
      if (institution) {
        if (institution.error) {
          dispatch(setNotification(t('error.get_customer'), NotificationVariant.Error));
        } else if (institution.data) {
          setCustomerInstitution(institution.data);
        }
        setIsLoading(false);
      }
    };
    if (customerId) {
      fetchCustomerInstitution();
    }
  }, [t, dispatch, cancelToken, customerId]);

  return [customerInstitution, isLoading, handleSetCustomerInstitution];
};

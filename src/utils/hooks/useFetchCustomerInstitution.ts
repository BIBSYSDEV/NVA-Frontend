import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { CustomerInstitution } from '../../types/customerInstitution.types';
import { getCustomerInstitution } from '../../api/customerInstitutionsApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';

export const useFetchCustomerInstitution = (
  identifier: string,
  editMode: boolean = false
): [CustomerInstitution | undefined, boolean, (customerInstitution: CustomerInstitution) => void] => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [customerInstitution, setCustomerInstitution] = useState<CustomerInstitution>();

  const handleSetCustomerInstitution = (customerInstitution: CustomerInstitution) => {
    setCustomerInstitution(customerInstitution);
  };

  useEffect(() => {
    if (!editMode) {
      setIsLoading(false);
    }
  }, [editMode]);

  useEffect(() => {
    const cancelSource = Axios.CancelToken.source();

    const fetchCustomerInstitution = async () => {
      const institution: CustomerInstitution = await getCustomerInstitution(identifier, cancelSource.token);
      if (institution) {
        if (institution.error) {
          dispatch(setNotification(institution.error, NotificationVariant.Error));
        } else {
          setCustomerInstitution(institution);
        }
      }
      setIsLoading(false);
    };
    if (identifier && editMode) {
      fetchCustomerInstitution();
    }
    return () => {
      if (identifier && editMode) {
        cancelSource.cancel();
      }
    };
  }, [dispatch, identifier, editMode]);

  return [customerInstitution, isLoading, handleSetCustomerInstitution];
};

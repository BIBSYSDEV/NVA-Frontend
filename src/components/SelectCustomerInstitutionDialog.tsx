import { LoadingButton } from '@mui/lab';
import { Dialog, DialogTitle, DialogContent, Autocomplete, TextField, DialogActions } from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { RoleApiPath } from '../api/apiPaths';
import { apiRequest, authenticatedApiRequest } from '../api/apiRequest';
import { getCurrentUserAttributes } from '../api/userApi';
import { setPartialUser, setUser } from '../redux/userSlice';
import { setNotification } from '../redux/notificationSlice';
import { CustomerInstitution } from '../types/customerInstitution.types';
import { isSuccessStatus } from '../utils/constants';
import { sortCustomerInstitutions } from '../utils/institutions-helpers';

interface SelectCustomerInstitutionDialogProps {
  allowedCustomerIds: string[];
  openDefault: boolean;
}

export const SelectCustomerInstitutionDialog = ({
  allowedCustomerIds,
  openDefault,
}: SelectCustomerInstitutionDialogProps) => {
  const { t } = useTranslation('authorization');
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(openDefault);
  const [allowedCustomers, setAllowedCustomers] = useState<CustomerInstitution[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isSelectingCustomer, setIsSelectingCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInstitution | null>(null);

  useEffect(() => {
    const fetchAllowedCustomers = async () => {
      const allowedCustomersPromises = allowedCustomerIds.map(async (id) => {
        const customerResponse = await apiRequest<CustomerInstitution>({ url: id });
        if (isSuccessStatus(customerResponse.status)) {
          return customerResponse.data;
        }
      });
      const customers = (await Promise.all(allowedCustomersPromises)).filter(
        (customer) => customer // Remove null/undefined objects
      ) as CustomerInstitution[];
      setAllowedCustomers(sortCustomerInstitutions(customers));
      setIsLoadingCustomers(false);
    };
    fetchAllowedCustomers();
  }, [allowedCustomerIds]);

  const selectCustomer = async () => {
    setIsSelectingCustomer(true);
    const customerId = selectedCustomer?.id;
    if (customerId) {
      try {
        const response = await authenticatedApiRequest({
          url: RoleApiPath.Login,
          method: 'POST',
          data: { customerId },
        });
        if (isSuccessStatus(response.status)) {
          const newUserInfo = await getCurrentUserAttributes();
          dispatch(setUser(newUserInfo));
          dispatch(setPartialUser({ customerShortName: selectedCustomer.shortName }));
          setOpenDialog(false);
        }
      } catch {
        dispatch(setNotification({ message: t('feedback:error.an_error_occurred'), variant: 'error' }));
      }
    }
    setIsSelectingCustomer(false);
  };

  return (
    <Dialog open={openDialog} fullWidth maxWidth="sm">
      <DialogTitle>{t('select_institution')}</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={allowedCustomers}
          getOptionLabel={(option) => option.displayName}
          loading={isLoadingCustomers}
          onChange={(_, value) => setSelectedCustomer(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              InputLabelProps={{
                'aria-label': t('select_institution'),
              }}
              placeholder={t('project:search_for_institution')}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <LoadingButton
          variant="contained"
          loading={isSelectingCustomer}
          disabled={!selectedCustomer}
          onClick={selectCustomer}>
          {t('translations:common.select')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

import { LoadingButton } from '@mui/lab';
import { Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { RoleApiPath } from '../api/apiPaths';
import { authenticatedApiRequest } from '../api/apiRequest';
import { fetchOrganizations } from '../api/cristinApi';
import { setNotification } from '../redux/notificationSlice';
import { setUser } from '../redux/userSlice';
import { CustomerInstitution } from '../types/customerInstitution.types';
import { FeideUser } from '../types/user.types';
import { isSuccessStatus } from '../utils/constants';
import { sortCustomerInstitutions } from '../utils/institutions-helpers';
import { OrganizationRenderOption } from './OrganizationRenderOption';

interface SelectCustomerInstitutionDialogProps {
  allowedCustomerIds: string[];
}

export const SelectCustomerInstitutionDialog = ({ allowedCustomerIds }: SelectCustomerInstitutionDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // const { handleLogin, handleLogout } = useAuthentication();
  const [openDialog, setOpenDialog] = useState(allowedCustomerIds.length > 1);
  const [allowedCustomers, setAllowedCustomers] = useState<CustomerInstitution[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isSelectingCustomer, setIsSelectingCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInstitution | null>(null);

  useEffect(() => {
    const fetchAllowedCustomers = async () => {
      const allowedCustomersPromises = allowedCustomerIds.map(async (id) => {
        const customerResponse = await authenticatedApiRequest<CustomerInstitution>({ url: id });
        if (isSuccessStatus(customerResponse.status)) {
          return customerResponse.data;
        } else {
          return;
        }
      });
      const customers = (await Promise.all(allowedCustomersPromises)).filter(
        (customer) => customer // Remove null/undefined objects
      ) as CustomerInstitution[];
      setAllowedCustomers(sortCustomerInstitutions(customers));
      setIsLoadingCustomers(false);
    };
    if (allowedCustomerIds.length > 1) {
      fetchAllowedCustomers();
    }
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
          const newSession = await fetchAuthSession({ forceRefresh: true });
          const userAttributes = newSession.tokens?.idToken?.payload as FeideUser | undefined;
          if (userAttributes) {
            dispatch(setUser(userAttributes));
          }

          setOpenDialog(false);
        }
      } catch {
        dispatch(setNotification({ message: t('feedback.error.an_error_occurred'), variant: 'error' }));
      }
    }
    setIsSelectingCustomer(false);
  };

  const customersCristinIds = allowedCustomers.map((customer) => customer.cristinId);

  const organizationQuery = useQuery({
    enabled: !!customersCristinIds,
    queryKey: ['organizations', customersCristinIds],
    queryFn: customersCristinIds ? () => fetchOrganizations(customersCristinIds) : undefined,
    meta: { errorMessage: t('feedback.error.get_institution') },
    gcTime: 1_800_000, // 30 minutes
  });

  const organizations = organizationQuery.data;

  return (
    <Dialog open={openDialog} fullWidth maxWidth="sm">
      <DialogTitle>{t('common.select_institution')}</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={allowedCustomers}
          getOptionLabel={(option) => option.displayName}
          loading={isLoadingCustomers}
          onChange={(_, value) => setSelectedCustomer(value)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderOption={({ key, ...props }, option) => {
            const organization = organizations && organizations.find((org) => org.id === option.cristinId);
            return organization ? (
              <OrganizationRenderOption key={organization.id} props={props} option={organization} />
            ) : (
              <li {...props} key={option.id}>
                <Typography fontWeight="bold">{option.displayName}</Typography>
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              InputLabelProps={{
                'aria-label': t('common.select_institution'),
              }}
              placeholder={t('project.search_for_institution')}
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
          {t('common.select')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

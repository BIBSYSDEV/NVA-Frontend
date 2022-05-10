import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { FlatCristinUser, RoleName } from '../../../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { convertToFlatCristinUser } from '../../../utils/user-helpers';
import { StartDateField } from '../fields/StartDateField';
import { PositionField } from '../fields/PositionField';
import { addCustomerAdminValidationSchema } from '../../../utils/validation/basic_data/addEmployeeValidation';
import { setNotification } from '../../../redux/notificationSlice';
import { addEmployment, searchByNationalIdNumber } from '../../../api/userApi';
import { createUser } from '../../../api/roleApi';

interface AddAdminDialogProps extends Pick<DialogProps, 'open'> {
  toggleOpen: () => void;
  refetchInstitutionUsers: () => void;
  cristinInstitutionId: string;
}

interface AddAdminFormData {
  startDate: string;
  position: string;
}

const addAdminInitialValues: AddAdminFormData = { startDate: '', position: '' };

export const AddAdminDialog = ({
  open,
  toggleOpen,
  refetchInstitutionUsers,
  cristinInstitutionId,
}: AddAdminDialogProps) => {
  const { t } = useTranslation('basicData');
  const dispatch = useDispatch();
  const location = useLocation();
  const [nationalIdNumber, setNationalIdNumber] = useState('');
  const [cristinUser, setCristinUser] = useState<FlatCristinUser>();
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const isEmployedInThisOrganization = cristinUser?.affiliations.some(
    (affiliation) =>
      affiliation.active && cristinInstitutionId.startsWith(affiliation.organization.split('.').slice(0, -3).join('.')) // Remove last 3 subunit values to find out if user already has an employment in this institution
  );

  useEffect(() => {
    // Search when user has entered 11 chars as a Norwegian National ID is 11 chars long
    if (nationalIdNumber.length === 11) {
      const searchByNationalId = async () => {
        setIsLoadingSearch(true);
        const searchResponse = await searchByNationalIdNumber(nationalIdNumber);
        if (isSuccessStatus(searchResponse.status)) {
          setCristinUser(convertToFlatCristinUser(searchResponse.data));
        } else if (isErrorStatus(searchResponse.status)) {
          dispatch(setNotification({ message: t('feedback:error.search'), variant: 'error' }));
          setCristinUser(undefined);
        }
        setIsLoadingSearch(false);
      };
      searchByNationalId();
    } else {
      setCristinUser(undefined);
    }
  }, [t, dispatch, nationalIdNumber]);

  const addAdmin = async (values: AddAdminFormData, { resetForm }: FormikHelpers<AddAdminFormData>) => {
    if (cristinUser) {
      // Add employment/affiliation (in Cristin) if user don't have one in the current institution
      if (!isEmployedInThisOrganization) {
        const addAffiliationResponse = await addEmployment(cristinUser.id, {
          type: values.position,
          startDate: values.startDate,
          organization: cristinInstitutionId,
        });
        if (isErrorStatus(addAffiliationResponse.status)) {
          dispatch(setNotification({ message: t('feedback:error.add_employment'), variant: 'error' }));
          return;
        }
      }

      // Create NVA User with admin role
      const customerId = new URLSearchParams(location.search).get('id') as string;
      const createNvaUserResponse = await createUser({
        nationalIdentityNumber: nationalIdNumber,
        customerId,
        roles: [
          { type: 'Role', rolename: RoleName.InstitutionAdmin },
          { type: 'Role', rolename: RoleName.Creator },
        ],
      });
      if (isErrorStatus(createNvaUserResponse.status)) {
        dispatch(setNotification({ message: t('feedback:error.create_user'), variant: 'error' }));
      } else if (isSuccessStatus(createNvaUserResponse.status)) {
        dispatch(setNotification({ message: t('feedback:success.admin_added'), variant: 'success' }));
        closeDialog();
        resetForm();
        refetchInstitutionUsers();
      }
    }
  };

  const closeDialog = () => {
    toggleOpen();
    setNationalIdNumber('');
    setCristinUser(undefined);
  };

  return (
    <Dialog open={open} onClose={closeDialog} fullWidth>
      <DialogTitle>{t('common:add_custom', { name: t('profile:roles.institution_admin') })}</DialogTitle>
      <Formik
        initialValues={addAdminInitialValues}
        validationSchema={!isEmployedInThisOrganization ? addCustomerAdminValidationSchema : null}
        onSubmit={addAdmin}>
        {({ isSubmitting }: FormikProps<AddAdminFormData>) => (
          <Form noValidate>
            <DialogContent>
              <TextField
                variant="filled"
                label={t('basicData:search_for_national_id')}
                disabled={isSubmitting}
                fullWidth
                onChange={({ target: { value } }) => value.length <= 11 && setNationalIdNumber(value)}
                InputProps={{
                  endAdornment: <SearchIcon color="disabled" />,
                }}
              />
              <Box sx={{ mt: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {isLoadingSearch ? (
                  <CircularProgress />
                ) : cristinUser ? (
                  <>
                    <TextField
                      variant="filled"
                      disabled
                      label={t('common:name')}
                      required
                      fullWidth
                      value={`${cristinUser.firstName} ${cristinUser.lastName}`}
                    />
                    {!isEmployedInThisOrganization && (
                      <Box sx={{ display: 'flex', gap: '1rem', width: '100%' }}>
                        <StartDateField fieldName="startDate" disabled={isSubmitting} />
                        <PositionField fieldName="position" disabled={isSubmitting} />
                      </Box>
                    )}
                  </>
                ) : (
                  nationalIdNumber.length === 11 && <Typography>{t('no_matching_persons_found')}</Typography>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog}>{t('common:cancel')}</Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                startIcon={<AddIcon />}
                disabled={!cristinUser || nationalIdNumber.length !== 11}>
                {t('common:add')}
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

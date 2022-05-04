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
import { Form, Formik, FormikHelpers } from 'formik';
import { CristinApiPath } from '../../../api/apiPaths';
import { authenticatedApiRequest } from '../../../api/apiRequest';
import { FlatCristinUser, CristinUser, Employment } from '../../../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { convertToFlatCristinUser } from '../../../utils/user-helpers';
import { StartDateField } from '../fields/StartDateField';
import { PositionField } from '../fields/PositionField';
import { addCustomerAdminValidationSchema } from '../../../utils/validation/basic_data/addEmployeeValidation';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../redux/notificationSlice';

interface AddAdminDialogProps extends Pick<DialogProps, 'open'> {
  toggleOpen: () => void;
  cristinInstitutionId: string;
}

interface AddAdminFormData {
  startDate: string;
  position: string;
}

const addAdminInitialValues: AddAdminFormData = { startDate: '', position: '' };

export const AddAdminDialog = ({ open, toggleOpen, cristinInstitutionId }: AddAdminDialogProps) => {
  const { t } = useTranslation('basicData');
  const dispatch = useDispatch();
  const [nationalIdNumber, setNationalIdNumber] = useState('');
  const [cristinUser, setCristinUser] = useState<FlatCristinUser>();
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  useEffect(() => {
    // Search when user has entered 11 chars as a Norwegian National ID is 11 chars long
    if (nationalIdNumber.length === 11) {
      const searchByNationalId = async () => {
        setIsLoadingSearch(true);
        const searchResponse = await authenticatedApiRequest<CristinUser>({
          url: CristinApiPath.PersonIdentityNumer,
          method: 'POST',
          data: {
            type: 'NationalIdentificationNumber',
            value: nationalIdNumber,
          },
        });
        if (isSuccessStatus(searchResponse.status)) {
          setCristinUser(convertToFlatCristinUser(searchResponse.data));
        } else if (isErrorStatus(searchResponse.status)) {
          dispatch(setNotification({ message: t('feedback:error.search'), variant: 'error' }));
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
      // Add employment/affiliation (in Cristin) if user don't have one yet

      const isEmployed = cristinUser.affiliations.some(
        (affiliation) =>
          affiliation.active &&
          cristinInstitutionId.startsWith(affiliation.organization.split('.').slice(0, -3).join('.')) // Remove last 3 subunit values to find out if user already has an employment in this institution
      );

      if (!isEmployed) {
        const addAffiliationResponse = await authenticatedApiRequest<Employment>({
          url: `${cristinUser.id}/employment`,
          method: 'POST',
          data: {
            type: values.position,
            startDate: values.startDate,
            organization: cristinInstitutionId,
          },
        });
        if (isErrorStatus(addAffiliationResponse.status)) {
          dispatch(setNotification({ message: t('feedback:error.add_employment'), variant: 'error' }));
          return;
        }

        // TODO: Create NVA User with admin role (NP-9076)

        toggleOpen();
        resetForm();
        setNationalIdNumber('');
        setCristinUser(undefined);
      }
    }
  };

  return (
    <Dialog open={open} onClose={toggleOpen} fullWidth>
      <DialogTitle>{t('common:add_custom', { name: t('profile:roles.institution_admin') })}</DialogTitle>
      <Formik
        initialValues={addAdminInitialValues}
        validationSchema={addCustomerAdminValidationSchema}
        onSubmit={addAdmin}>
        <Form noValidate>
          <DialogContent>
            <TextField
              variant="filled"
              label={t('basicData:search_for_national_id')}
              sx={{ minWidth: '20rem' }}
              onChange={(event) => event.target.value.length <= 11 && setNationalIdNumber(event.target.value)}
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
                  <Box sx={{ display: 'flex', gap: '1rem', width: '100%' }}>
                    <StartDateField fieldName="startDate" />
                    <PositionField fieldName="position" />
                  </Box>
                </>
              ) : (
                nationalIdNumber.length === 11 && <Typography>{t('no_matching_persons_found')}</Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleOpen}>{t('common:cancel')}</Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<AddIcon />}
              disabled={!cristinUser || nationalIdNumber.length !== 11}>
              {t('common:add')}
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};

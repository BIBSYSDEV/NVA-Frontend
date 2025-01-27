import AddIcon from '@mui/icons-material/Add';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { addEmployment } from '../../../api/cristinApi';
import { createUser } from '../../../api/roleApi';
import { setNotification } from '../../../redux/notificationSlice';
import { FlatCristinPerson, RoleName } from '../../../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { addCustomerAdminValidationSchema } from '../../../utils/validation/basic_data/addEmployeeValidation';
import { SearchForCristinPerson } from '../SearchForCristinPerson';
import { PositionField } from '../fields/PositionField';
import { StartDateField } from '../fields/StartDateField';

interface AddAdminDialogProps extends Pick<DialogProps, 'open'> {
  toggleOpen: () => void;
  refetchInstitutionUsers: () => void;
  cristinInstitutionId: string;
}

export interface AddAdminFormData {
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
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const [cristinPerson, setCristinPerson] = useState<FlatCristinPerson>();

  const isEmployedInThisOrganization = cristinPerson?.affiliations.some(
    (affiliation) =>
      affiliation.active && cristinInstitutionId.startsWith(affiliation.organization.split('.').slice(0, -3).join('.')) // Remove last 3 subunit values to find out if user already has an employment in this institution
  );

  const addAdmin = async (values: AddAdminFormData, { resetForm }: FormikHelpers<AddAdminFormData>) => {
    if (cristinPerson) {
      // Add employment/affiliation (in Cristin) if user don't have one in the current institution
      if (!isEmployedInThisOrganization) {
        const addAffiliationResponse = await addEmployment(cristinPerson.id, {
          type: values.position,
          startDate: values.startDate,
          organization: cristinInstitutionId,
        });
        if (isErrorStatus(addAffiliationResponse.status)) {
          dispatch(setNotification({ message: t('feedback.error.add_employment'), variant: 'error' }));
          return;
        }
      }

      // Create NVA User with admin role
      const customerId = new URLSearchParams(location.search).get('id') as string;
      const createNvaUserResponse = await createUser({
        cristinIdentifier: cristinPerson.cristinIdentifier,
        customerId,
        roles: [
          { type: 'Role', rolename: RoleName.InstitutionAdmin },
          { type: 'Role', rolename: RoleName.Creator },
        ],
        viewingScope: { type: 'ViewingScope', includedUnits: [] },
      });
      if (isErrorStatus(createNvaUserResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.create_user'), variant: 'error' }));
      } else if (isSuccessStatus(createNvaUserResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.admin_added'), variant: 'success' }));
        closeDialog();
        resetForm();
        refetchInstitutionUsers();
      }
    }
  };

  const closeDialog = () => {
    toggleOpen();
    setCristinPerson(undefined);
  };

  return (
    <Dialog open={open} onClose={closeDialog} fullWidth>
      <DialogTitle>{t('common.add_custom', { name: t('my_page.roles.institution_admin') })}</DialogTitle>
      <Formik
        initialValues={addAdminInitialValues}
        validationSchema={!isEmployedInThisOrganization ? addCustomerAdminValidationSchema : null}
        onSubmit={addAdmin}>
        {({ isSubmitting }: FormikProps<AddAdminFormData>) => (
          <Form noValidate>
            <DialogContent>
              <SearchForCristinPerson
                selectedPerson={cristinPerson}
                setSelectedPerson={setCristinPerson}
                disabled={isSubmitting}
              />

              {cristinPerson && !isEmployedInThisOrganization && (
                <Box sx={{ display: 'flex', gap: '1rem', mt: '1rem' }}>
                  <StartDateField fieldName="startDate" disabled={isSubmitting} />
                  <PositionField fieldName="position" disabled={isSubmitting} />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog}>{t('common.cancel')}</Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                startIcon={<AddIcon />}
                disabled={!cristinPerson}>
                {t('common.add_custom', { name: t('my_page.roles.institution_admin').toLocaleLowerCase() })}
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

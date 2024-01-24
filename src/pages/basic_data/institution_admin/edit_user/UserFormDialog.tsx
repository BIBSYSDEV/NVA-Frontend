import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Divider } from '@mui/material';
import { Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { CristinPerson, InstitutionUser, RoleName } from '../../../../types/user.types';
import { personDataValidationSchema } from '../../../../utils/validation/basic_data/addEmployeeValidation';
import { UserRolesSelector } from '../UserRolesSelector';
import { ViewingScopeSection } from '../ViewingScopeSection';
import { AffiliationFormSection } from './AffiliationFormSection';
import { PersonFormSection } from './PersonFormSection';

interface UserFormDialogProps extends Pick<DialogProps, 'open'> {
  person: CristinPerson;
  onClose: () => void;
}

export interface UserFormData {
  person?: CristinPerson;
  user?: InstitutionUser;
}

export const UserFormDialog = ({ open, onClose, person }: UserFormDialogProps) => {
  const { t } = useTranslation();

  const initialValues: UserFormData = {
    person,
    user: undefined,
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth transitionDuration={{ exit: 0 }}>
      <DialogTitle>{t('basic_data.person_register.edit_person')}</DialogTitle>
      <Formik
        initialValues={initialValues}
        // enableReinitialize // Needed to update roles values when the institutionUser is recieved
        onSubmit={(values) => console.log('values', values)}
        validationSchema={personDataValidationSchema}>
        {({ isSubmitting }: FormikProps<UserFormData>) => (
          <Form noValidate>
            <DialogContent>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr auto 1fr', gap: '1rem' }}>
                <PersonFormSection />
                <Divider flexItem orientation="vertical" />
                <AffiliationFormSection />
                <Divider flexItem orientation="vertical" />
                <section>
                  <UserRolesSelector
                    selectedRoles={[]}
                    updateRoles={function (roles: RoleName[]): void {
                      throw new Error('Function not implemented.');
                    }}
                    personHasNin={false}
                  />
                </section>
                <Divider flexItem orientation="vertical" />
                <ViewingScopeSection />
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button onClick={onClose}>{t('common.cancel')}</Button>
              <LoadingButton loading={isSubmitting} variant="contained" type="submit">
                {t('common.save')}
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

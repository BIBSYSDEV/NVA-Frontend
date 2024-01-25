import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Divider } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchUser } from '../../../../api/roleApi';
import { RootState } from '../../../../redux/store';
import { CristinPerson, InstitutionUser, RoleName } from '../../../../types/user.types';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { personDataValidationSchema } from '../../../../utils/validation/basic_data/addEmployeeValidation';
import { AffiliationFormSection } from './AffiliationFormSection';
import { PersonFormSection } from './PersonFormSection';
import { RolesFormSection } from './RolesFormSection';
import { TasksFormSection } from './TasksFormSection';

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
  const user = useSelector((store: RootState) => store.user);
  const topOrgCristinId = user?.topOrgCristinId;
  const customerId = user?.customerId;

  const personCristinIdentifier = getIdentifierFromId(person.id);
  const topOrgCristinIdentifier = topOrgCristinId ? getIdentifierFromId(topOrgCristinId) : '';
  const username =
    personCristinIdentifier && topOrgCristinIdentifier ? `${personCristinIdentifier}@${topOrgCristinIdentifier}` : '';

  const institutionUserQuery = useQuery({
    enabled: open && !!username,
    queryKey: [username],
    queryFn: () => fetchUser(username),
    meta: { errorMessage: false }, // No error message, since a Cristin Person will lack User if they have not logged in yet
    retry: false,
  });

  const initialValues: UserFormData = {
    person,
    user: institutionUserQuery.isError
      ? {
          institution: customerId ?? '',
          roles: [{ type: 'Role', rolename: RoleName.Creator }],
          username: username,
        }
      : institutionUserQuery.data,
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth transitionDuration={{ exit: 0 }}>
      <DialogTitle>{t('basic_data.person_register.edit_person')}</DialogTitle>

      <Formik
        initialValues={initialValues}
        enableReinitialize // Needed to update roles values when the institutionUser is recieved
        onSubmit={(values) => console.log('values', values)}
        validationSchema={personDataValidationSchema}>
        {({ isSubmitting }: FormikProps<UserFormData>) => (
          <Form noValidate>
            <DialogContent>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr auto 1fr', gap: '1rem' }}>
                <PersonFormSection />
                <Divider orientation="vertical" />
                <AffiliationFormSection />
                <Divider orientation="vertical" />
                <RolesFormSection isLoadingUser={institutionUserQuery.isLoading} />
                <Divider orientation="vertical" />
                <TasksFormSection isLoadingUser={institutionUserQuery.isLoading} />
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button onClick={onClose}>{t('common.cancel')}</Button>
              <LoadingButton
                loading={isSubmitting}
                disabled={institutionUserQuery.isLoading}
                variant="contained"
                type="submit">
                {t('common.save')}
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

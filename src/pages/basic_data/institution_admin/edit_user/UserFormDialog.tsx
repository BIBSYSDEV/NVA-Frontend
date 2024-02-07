import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { getById } from '../../../../api/commonApi';
import { updateCristinPerson } from '../../../../api/cristinApi';
import { createUser, fetchUser, updateUser } from '../../../../api/roleApi';
import { PageSpinner } from '../../../../components/PageSpinner';
import { setNotification } from '../../../../redux/notificationSlice';
import { RootState } from '../../../../redux/store';
import { CristinPerson, InstitutionUser, RoleName } from '../../../../types/user.types';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { getValueByKey } from '../../../../utils/user-helpers';
import { personDataValidationSchema } from '../../../../utils/validation/basic_data/addEmployeeValidation';
import { AffiliationFormSection } from './AffiliationFormSection';
import { PersonFormSection } from './PersonFormSection';
import { RolesFormSection } from './RolesFormSection';
import { TasksFormSection } from './TasksFormSection';

export enum UserFormFieldName {
  Employments = 'person.employments',
  Roles = 'user.roles',
  ViewingScope = 'user.viewingScope.includedUnits',
}

const validationSchema = Yup.object().shape({
  person: personDataValidationSchema,
});

interface UserFormDialogProps extends Pick<DialogProps, 'open'> {
  existingPerson: CristinPerson | string;
  existingUser?: InstitutionUser;
  onClose: () => void;
}

export interface UserFormData {
  person?: CristinPerson;
  user?: InstitutionUser;
}

export const UserFormDialog = ({ open, onClose, existingUser, existingPerson }: UserFormDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);
  const topOrgCristinId = user?.topOrgCristinId;
  const customerId = user?.customerId ?? '';

  const personId = typeof existingPerson === 'string' ? existingPerson : existingPerson.id;
  const existingPersonObject = typeof existingPerson === 'object' ? existingPerson : undefined;

  const personQuery = useQuery({
    enabled: open && !existingPersonObject && !!personId,
    queryKey: [personId],
    queryFn: () => getById<CristinPerson>(personId),
    meta: { errorMessage: t('feedback.error.get_person') },
    initialData: existingPersonObject,
  });

  const personCristinIdentifier = getValueByKey('CristinIdentifier', personQuery.data?.identifiers);
  const topOrgCristinIdentifier = topOrgCristinId ? getIdentifierFromId(topOrgCristinId) : '';
  const username =
    personCristinIdentifier && topOrgCristinIdentifier ? `${personCristinIdentifier}@${topOrgCristinIdentifier}` : '';

  const institutionUserQuery = useQuery({
    enabled: open && !existingUser && !!username,
    queryKey: [username],
    queryFn: () => fetchUser(username),
    meta: { errorMessage: false }, // No error message, since a Cristin Person will lack User if they have not logged in yet
    retry: false,
    initialData: existingUser,
  });

  const personMutation = useMutation({
    mutationFn: async (person: CristinPerson) => {
      if (!person.verified) {
        person.keywords = undefined; // Person must be verified to have keywords
      }

      return await updateCristinPerson(person.id, person);
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_person'), variant: 'error' })),
  });

  const userMutation = useMutation({
    mutationFn: async (user: InstitutionUser) => {
      const filteredRoles = !user.roles.some((role) => role.rolename === RoleName.PublishingCurator)
        ? user.roles.filter(
            (role) => role.rolename !== RoleName.CuratorThesis && role.rolename !== RoleName.CuratorThesisEmbargo
          )
        : user.roles;
      user.roles = filteredRoles;
      if (institutionUserQuery.isSuccess) {
        return await updateUser(user.username, user);
      } else {
        return await createUser({
          customerId,
          roles: user.roles,
          nationalIdentityNumber: getValueByKey('NationalIdentificationNumber', personQuery.data?.identifiers),
        });
      }
    },
    onError: () =>
      dispatch(setNotification({ message: t('feedback.error.update_institution_user'), variant: 'error' })),
    onSuccess: () =>
      dispatch(setNotification({ message: t('feedback.success.update_institution_user'), variant: 'success' })),
  });

  const initialValues: UserFormData = {
    person: personQuery.data,
    user: institutionUserQuery.isError
      ? {
          institution: customerId,
          roles: [{ type: 'Role', rolename: RoleName.Creator }],
          username: username,
        }
      : institutionUserQuery.data,
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth transitionDuration={{ exit: 0 }}>
      <DialogTitle id="edit-user-heading">{t('basic_data.person_register.edit_person')}</DialogTitle>

      <Formik
        initialValues={initialValues}
        enableReinitialize // Needed to update user values when institutionUser is fetched
        onSubmit={async (values) => {
          if (!values.person || !values.user) {
            return;
          }

          try {
            await personMutation.mutateAsync(values.person);
            await userMutation.mutateAsync(values.user);
            await institutionUserQuery.refetch();
            onClose();
          } catch {
            return;
          }
        }}
        validationSchema={validationSchema}>
        {({ isSubmitting, values, setFieldValue }: FormikProps<UserFormData>) => (
          <Form noValidate>
            <DialogContent sx={{ minHeight: '30vh' }}>
              {(!values.person && personQuery.isLoading) || (!values.user && institutionUserQuery.isLoading) ? (
                <PageSpinner aria-labelledby="edit-user-heading" />
              ) : !values.person ? (
                <Typography>{t('feedback.error.get_person')}</Typography>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '1fr auto 1fr auto 1fr auto 1fr' },
                    gap: '1rem',
                  }}>
                  <PersonFormSection />
                  <Divider orientation="vertical" />
                  <AffiliationFormSection />
                  <Divider orientation="vertical" />
                  <RolesFormSection
                    personHasNin={!!values.person?.verified}
                    roles={values.user?.roles.map((role) => role.rolename) ?? []}
                    updateRoles={(newRoles) => setFieldValue(UserFormFieldName.Roles, newRoles)}
                  />
                  <Divider orientation="vertical" />
                  <TasksFormSection roles={values.user?.roles.map((role) => role.rolename)} />
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button onClick={onClose}>{t('common.cancel')}</Button>
              <LoadingButton
                loading={isSubmitting}
                disabled={!values.person || !values.user}
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

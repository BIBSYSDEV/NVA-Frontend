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
import { Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { PageSpinner } from '../../../../components/PageSpinner';
import { CristinPerson, InstitutionUser, RoleName, UserRole } from '../../../../types/user.types';
import {
  checkIfPersonHasNationalIdentificationNumber,
  getEmployments,
  getUsername,
} from '../../../../utils/user-helpers';
import { AffiliationFormSection } from './AffiliationFormSection';
import { PersonFormSection } from './PersonFormSection';
import { RolesFormSection } from './RolesFormSection';
import { rolesWithAreaOfResponsibility, TasksFormSection } from './TasksFormSection';
import { UserFormData, UserFormFieldName, validationSchema } from './userFormHelpers';
import { useUpdateCristinPerson } from '../../../../api/hooks/useUpdateCristinPerson';
import { useUpdateInstitutionUser } from '../../../../api/hooks/useUpdateInstitutionUser';
import { useLoggedinUser } from '../../../../utils/hooks/useLoggedinUser';
import { useProtectedPerson } from '../../../../utils/hooks/useProtectedPerson';
import { useInstitutionUser } from '../../../../utils/hooks/useInstitutionUser';

interface UserFormDialogProps extends Pick<DialogProps, 'open'> {
  existingPerson: CristinPerson | string;
  existingUser?: InstitutionUser;
  onClose: () => void;
}

export const UserFormDialog = ({ open, onClose, existingUser, existingPerson }: UserFormDialogProps) => {
  const { t } = useTranslation();
  const { topOrgCristinId, customerId } = useLoggedinUser();
  const { person, personQuery } = useProtectedPerson(existingPerson, open);
  const username = getUsername(person, topOrgCristinId);
  const { institutionUser, institutionUserQuery } = useInstitutionUser(existingUser, username, open);
  const personMutation = useUpdateCristinPerson();
  const userMutation = useUpdateInstitutionUser();
  const { internalEmployments, externalEmployments } = getEmployments(person, topOrgCristinId);

  const initialValues: UserFormData = {
    person: person ? { ...person, employments: internalEmployments } : person,
    user: institutionUserQuery.isError
      ? {
          institution: customerId,
          roles: [{ type: 'Role', rolename: RoleName.Creator }],
          username: username,
          viewingScope: { type: 'ViewingScope', includedUnits: [] },
        }
      : institutionUser,
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
            await userMutation.mutateAsync({
              institutionUser: values.user,
              customerId,
              cristinPerson: person,
              institutionUserQuery,
            });
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
              {(!values.person && personQuery.isPending) || (!values.user && institutionUserQuery.isPending) ? (
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
                  <PersonFormSection externalEmployments={externalEmployments} />
                  <Divider orientation="vertical" />
                  <AffiliationFormSection />
                  <Divider orientation="vertical" />
                  <RolesFormSection
                    personHasNin={checkIfPersonHasNationalIdentificationNumber(values.person)}
                    roles={values.user?.roles?.map((role) => role.rolename) || []}
                    updateRoles={(newRoles) => {
                      const newUserRoles: UserRole[] = newRoles.map((role) => ({ type: 'Role', rolename: role }));
                      setFieldValue(UserFormFieldName.Roles, newUserRoles);

                      const hasCuratorRole = newRoles.some((role) => rolesWithAreaOfResponsibility.includes(role));
                      if (hasCuratorRole && !values.user?.viewingScope.includedUnits.length && topOrgCristinId) {
                        const defaultViewingScope =
                          values.person?.employments.find((employment) =>
                            values.person?.affiliations.some(
                              (affiliation) =>
                                affiliation.organization === employment.organization && affiliation.active
                            )
                          )?.organization ?? topOrgCristinId;
                        setFieldValue(UserFormFieldName.ViewingScope, [defaultViewingScope]);
                      } else if (!hasCuratorRole) {
                        setFieldValue(UserFormFieldName.ViewingScope, []);
                      }
                    }}
                  />
                  <Divider orientation="vertical" />
                  <TasksFormSection
                    roles={values.user?.roles.map((role) => role.rolename)}
                    viewingScopes={values.user?.viewingScope.includedUnits ?? []}
                    updateViewingScopes={(newViewingScopes) =>
                      setFieldValue(UserFormFieldName.ViewingScope, newViewingScopes)
                    }
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button onClick={onClose}>{t('common.cancel')}</Button>
              <Button
                loading={isSubmitting}
                disabled={!values.person || internalEmployments.length === 0 || !values.user}
                color="secondary"
                variant="contained"
                type="submit">
                {t('common.save')}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

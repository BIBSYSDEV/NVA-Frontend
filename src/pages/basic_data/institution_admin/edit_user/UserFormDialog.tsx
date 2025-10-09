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
import { useSelector } from 'react-redux';
import { PageSpinner } from '../../../../components/PageSpinner';
import { RootState } from '../../../../redux/store';
import { CristinPerson, InstitutionUser, RoleName } from '../../../../types/user.types';
import {
  checkIfPersonHasNationalIdentificationNumber,
  findFirstEmploymentThatMatchesAnActiveAffiliation,
  getEmployments,
  getUsername,
} from '../../../../utils/user-helpers';
import { AffiliationFormSection } from './AffiliationFormSection';
import { PersonFormSection } from './PersonFormSection';
import { RolesFormSection } from './RolesFormSection';
import { rolesWithAreaOfResponsibility, TasksFormSection } from './TasksFormSection';
import { UserFormData, UserFormFieldName, validationSchema } from './userFormHelpers';
import { useFetchProtectedPerson } from '../../../../api/hooks/useFetchProtectedPerson';
import { useFetchInstitutionUser } from '../../../../api/hooks/useFetchInstitutionUser';
import { useUpdateCristinPerson } from '../../../../api/hooks/useUpdateCristinPerson';
import { useUpdateInstitutionUser } from '../../../../api/hooks/useUpdateInstitutionUser';

interface UserFormDialogProps extends Pick<DialogProps, 'open'> {
  cristinInformation: CristinPerson | string;
  existingUser?: InstitutionUser;
  onClose: () => void;
}

export const UserFormDialog = ({ open, onClose, existingUser, cristinInformation }: UserFormDialogProps) => {
  const { t } = useTranslation();

  // Info about logged in user (TODO move out of component)
  const user = useSelector((store: RootState) => store.user);
  const topOrgCristinId = user?.topOrgCristinId;
  const customerId = user?.customerId ?? '';

  // Info about cristin user
  const cristinPersonId = typeof cristinInformation === 'string' ? cristinInformation : cristinInformation.id;
  const cristinPersonObject = typeof cristinInformation === 'object' ? cristinInformation : undefined;
  const cristinQuery = useFetchProtectedPerson(cristinPersonId, {
    enabled: open && !cristinPersonObject && !!cristinPersonId, // We only want to fetch if we don't already have the object
  });
  const cristinPerson = cristinPersonObject ?? cristinQuery.data;
  const { internalEmployments, externalEmployments } = getEmployments(cristinPerson, topOrgCristinId);
  const username = getUsername(cristinPerson, topOrgCristinId);

  // Info about institution user
  const institutionUserQuery = useFetchInstitutionUser(username, {
    enabled: open && !existingUser,
    errorMessage: false, // No error message, since a Cristin Person will lack User if they have not logged in yet
    retry: false,
    initialData: existingUser,
  });

  // Mutations
  const personMutation = useUpdateCristinPerson();
  const institutionUserMutation = useUpdateInstitutionUser();

  const initialValues: UserFormData = {
    person: cristinPerson ? { ...cristinPerson, employments: internalEmployments } : cristinPerson,
    user: institutionUserQuery.isError
      ? ({
          institution: customerId,
          roles: [{ type: 'Role', rolename: RoleName.Creator }],
          username: username,
          viewingScope: { type: 'ViewingScope', includedUnits: [] },
        } as InstitutionUser)
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
            await institutionUserMutation.mutateAsync({
              institutionUser: values.user,
              customerId,
              cristinPerson,
              institutionUserQuery,
            });
            await institutionUserQuery.refetch();
            onClose();
          } catch {
            // TODO: Vi må vel håndtere feil her?
            return;
          }
        }}
        validationSchema={validationSchema}>
        {({ isSubmitting, values, setFieldValue }: FormikProps<UserFormData>) => (
          <Form noValidate>
            <DialogContent sx={{ minHeight: '30vh' }}>
              {(!values.person && cristinQuery.isPending) || (!values.user && institutionUserQuery.isPending) ? (
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
                      setFieldValue(
                        UserFormFieldName.Roles,
                        newRoles.map((role) => ({ type: 'Role', rolename: role }))
                      );
                      const hasCuratorRole = newRoles.some((role) => rolesWithAreaOfResponsibility.includes(role));
                      const hasNoIncludedUnits = !values.user?.viewingScope.includedUnits.length;

                      if (hasCuratorRole && hasNoIncludedUnits && topOrgCristinId) {
                        const defaultViewingScope =
                          findFirstEmploymentThatMatchesAnActiveAffiliation(
                            values.person?.employments,
                            values.person?.affiliations
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

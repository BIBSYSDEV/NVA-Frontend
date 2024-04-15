import { LoadingButton } from '@mui/lab';
import { Box, Button, DialogActions, FormControl, FormGroup, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { Form, Formik, FormikProps } from 'formik';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../api/roleApi';
import { RoleSelectBox } from '../../../components/RoleSelectBox';
import { setNotification } from '../../../redux/notificationSlice';
import { InstitutionUser, RoleName } from '../../../types/user.types';
import { ViewingScopeChip } from '../../basic_data/institution_admin/edit_user/ViewingScopeChip';
import { OrganizationCuratorsAccordionProps } from './OrganizationCuratorsAccordion';

interface AddCuratorFormProps extends Pick<OrganizationCuratorsAccordionProps, 'refetchCurators'> {
  closeDialog: () => void;
  currentUser: InstitutionUser;
  initialValues: InstitutionUser;
}

export const AddCuratorForm = ({ closeDialog, currentUser, initialValues, refetchCurators }: AddCuratorFormProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const currentViewingScope = currentUser.viewingScope.includedUnits;
  const newViewingScope = initialValues.viewingScope.includedUnits;

  const allViewingScopes = Array.from(new Set([...currentViewingScope, ...newViewingScope]));

  const userMutation = useMutation({
    mutationFn: (user: InstitutionUser) => updateUser(user.username, user),
    onError: () =>
      dispatch(setNotification({ message: t('feedback.error.update_institution_user'), variant: 'error' })),
    onSuccess: async () => {
      await refetchCurators();
      dispatch(setNotification({ message: t('feedback.success.update_institution_user'), variant: 'success' }));
      closeDialog();
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={async (values) => await userMutation.mutateAsync(values)}>
      {({ values, setFieldValue, dirty, isSubmitting }: FormikProps<InstitutionUser>) => (
        <Form noValidate>
          <Typography variant="h3" gutterBottom>
            {t('editor.curators.area_of_responsibility')}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'start' }}>
            {allViewingScopes.map((organizationId) => {
              const isNewUnit =
                newViewingScope.includes(organizationId) && !currentViewingScope.includes(organizationId);
              const isRemovedUnit =
                !newViewingScope.includes(organizationId) && currentViewingScope.includes(organizationId);

              return (
                <Box key={organizationId} sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <ViewingScopeChip key={organizationId} organizationId={organizationId} disabled={isSubmitting} />
                  {isNewUnit && <Typography>(NY)</Typography>}
                  {isRemovedUnit && <Typography>(FJERNES)</Typography>}
                </Box>
              );
            })}
          </Box>

          <Typography variant="h3" sx={{ mt: '1rem' }} gutterBottom>
            {t('my_page.my_profile.heading.roles')}
          </Typography>
          <FormControl
            component="fieldset"
            onChange={(event: ChangeEvent<any>) => {
              const role = event.target.value as RoleName;

              const isRemovingRole = values.roles.some((thisRole) => thisRole.rolename === role);

              let newRoles = isRemovingRole
                ? values.roles.filter((selectedRole) => selectedRole.rolename !== role)
                : [...values.roles, { type: 'Role', rolename: role }];

              if (isRemovingRole) {
                // Remove roles that depend on the removed role
                if (role === RoleName.PublishingCurator) {
                  newRoles = newRoles.filter(
                    (role) =>
                      role.rolename !== RoleName.CuratorThesis && role.rolename !== RoleName.CuratorThesisEmbargo
                  );
                } else if (role === RoleName.CuratorThesis) {
                  newRoles = newRoles.filter((role) => role.rolename !== RoleName.CuratorThesisEmbargo);
                }
              }

              setFieldValue('roles', newRoles);
            }}
            // data-testid={dataTestId.basicData.personAdmin.roleSelector}
          >
            <FormGroup sx={{ gap: '0.25rem', ml: '0.5rem' }}>
              <RoleSelectBox
                sx={{ bgcolor: 'generalSupportCase.main' }}
                label={t('my_page.roles.support_curator')}
                description={t('my_page.roles.support_curator_description')}
                disabled={isSubmitting}
                checked={values.roles.some((role) => role.rolename === RoleName.SupportCurator)}
                value={RoleName.SupportCurator}
              />
              <RoleSelectBox
                sx={{ bgcolor: 'publishingRequest.main' }}
                label={t('my_page.roles.publishing_curator')}
                description={t('my_page.roles.publishing_curator_description')}
                disabled={isSubmitting}
                checked={values.roles.some((role) => role.rolename === RoleName.PublishingCurator)}
                value={RoleName.PublishingCurator}
              />
              <RoleSelectBox
                sx={{ bgcolor: 'publishingRequest.main', ml: '1rem' }}
                label={t('editor.curators.role.Curator-thesis')}
                disabled={isSubmitting || !values.roles.some((role) => role.rolename === RoleName.PublishingCurator)}
                checked={values.roles.some((role) => role.rolename === RoleName.CuratorThesis)}
                value={RoleName.CuratorThesis}
              />
              <RoleSelectBox
                sx={{ bgcolor: 'publishingRequest.main', ml: '2rem' }}
                label={t('editor.curators.role.Curator-thesis-embargo')}
                disabled={isSubmitting || !values.roles.some((role) => role.rolename === RoleName.CuratorThesis)}
                checked={values.roles.some((role) => role.rolename === RoleName.CuratorThesisEmbargo)}
                value={RoleName.CuratorThesisEmbargo}
              />
              <RoleSelectBox
                sx={{ bgcolor: 'doiRequest.main' }}
                label={t('my_page.roles.doi_curator')}
                description={t('my_page.roles.doi_curator_description')}
                disabled={isSubmitting}
                checked={values.roles.some((role) => role.rolename === RoleName.DoiCurator)}
                value={RoleName.DoiCurator}
              />
              <RoleSelectBox
                sx={{ bgcolor: 'nvi.main' }}
                label={t('my_page.roles.nvi_curator')}
                description={t('my_page.roles.nvi_curator_description')}
                disabled={isSubmitting}
                checked={values.roles.some((role) => role.rolename === RoleName.NviCurator)}
                value={RoleName.NviCurator}
              />
            </FormGroup>
          </FormControl>
          <DialogActions sx={{ justifyContent: 'center', p: 0 }}>
            <Button onClick={closeDialog}>{t('common.cancel')}</Button>
            <LoadingButton
              loading={isSubmitting}
              type="submit"
              variant="contained"
              disabled={!dirty && newViewingScope.at(-1) === currentViewingScope.at(-1)}>
              {t('common.add')}
            </LoadingButton>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

import { Checkbox, FormControl, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { RoleName, UserRole } from '../../../../types/user.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { UserFormData, UserFormFieldName } from './UserFormDialog';

interface RolesFormSectionProps {
  isLoadingUser: boolean;
}

export const RolesFormSection = ({ isLoadingUser }: RolesFormSectionProps) => {
  const { t } = useTranslation();
  const isAppAdmin = !!useSelector((store: RootState) => store.user?.isAppAdmin);
  const { values, isSubmitting, setFieldValue } = useFormikContext<UserFormData>();

  const personHasNin = !!values.person?.verified;
  const selectedRoles = values.user?.roles ?? [];

  return (
    <section>
      <Typography variant="h3" gutterBottom>
        {t('my_page.my_profile.heading.roles')}
      </Typography>

      {!personHasNin ? (
        <Typography>{t('basic_data.person_register.no_eligable_roles')}</Typography>
      ) : (
        <FormControl
          component="fieldset"
          onChange={(event: ChangeEvent<any>) => {
            const role = event.target.value as RoleName;
            const hasRole = selectedRoles.some((thisRole) => thisRole.rolename === role);
            const newRoles: UserRole[] = hasRole
              ? selectedRoles.filter((selectedRole) => selectedRole.rolename !== role)
              : [...selectedRoles, { type: 'Role', rolename: role }];
            setFieldValue(UserFormFieldName.Roles, newRoles);
          }}
          data-testid={dataTestId.basicData.personAdmin.roleSelector}
          disabled={isSubmitting || isLoadingUser}>
          <FormGroup sx={{ gap: '0.5rem' }}>
            <FormControlLabel
              disabled
              control={
                <Checkbox
                  checked={selectedRoles.some((role) => role.rolename === RoleName.Creator) || isLoadingUser}
                  value={RoleName.Creator}
                />
              }
              label={
                <RoleLabel title={t('my_page.roles.creator')} description={t('my_page.roles.creator_description')} />
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedRoles.some((role) => role.rolename === RoleName.PublishingCurator)}
                  value={RoleName.PublishingCurator}
                />
              }
              label={
                <RoleLabel
                  title={t('my_page.roles.publishing_curator')}
                  description={t('my_page.roles.publishing_curator_description')}
                />
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedRoles.some((role) => role.rolename === RoleName.DoiCurator)}
                  value={RoleName.DoiCurator}
                />
              }
              label={
                <RoleLabel
                  title={t('my_page.roles.doi_curator')}
                  description={t('my_page.roles.doi_curator_description')}
                />
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedRoles.some((role) => role.rolename === RoleName.SupportCurator)}
                  value={RoleName.SupportCurator}
                />
              }
              label={
                <RoleLabel
                  title={t('my_page.roles.support_curator')}
                  description={t('my_page.roles.support_curator_description')}
                />
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedRoles.some((role) => role.rolename === RoleName.NviCurator)}
                  value={RoleName.NviCurator}
                />
              }
              label={
                <RoleLabel
                  title={t('my_page.roles.nvi_curator')}
                  description={t('my_page.roles.nvi_curator_description')}
                />
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedRoles.some((role) => role.rolename === RoleName.Editor)}
                  value={RoleName.Editor}
                />
              }
              label={
                <RoleLabel title={t('my_page.roles.editor')} description={t('my_page.roles.editor_description')} />
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedRoles.some((role) => role.rolename === RoleName.InstitutionAdmin)}
                  value={RoleName.InstitutionAdmin}
                />
              }
              label={
                <RoleLabel
                  title={t('my_page.roles.institution_admin')}
                  description={t('my_page.roles.institution_admin_description')}
                />
              }
            />
            {isAppAdmin && (
              <FormGroup sx={{ border: '2px solid', p: '0.5rem', gap: '0.5rem' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedRoles.some((role) => role.rolename === RoleName.AppAdmin)}
                      value={RoleName.AppAdmin}
                    />
                  }
                  label={
                    <RoleLabel
                      title={t('my_page.roles.app_admin')}
                      description={t('my_page.roles.app_admin_description')}
                    />
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedRoles.some((role) => role.rolename === RoleName.InternalImporter)}
                      value={RoleName.InternalImporter}
                    />
                  }
                  label={
                    <RoleLabel
                      title={t('my_page.roles.internal_importer')}
                      description={t('my_page.roles.internal_importer_description')}
                    />
                  }
                />
              </FormGroup>
            )}
          </FormGroup>
        </FormControl>
      )}
    </section>
  );
};

interface RoleLabelProps {
  title: string;
  description: string;
}

const RoleLabel = ({ title, description }: RoleLabelProps) => (
  <>
    <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
    <Typography>{description}</Typography>
  </>
);

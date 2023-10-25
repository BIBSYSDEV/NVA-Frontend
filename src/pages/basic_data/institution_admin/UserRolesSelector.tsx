import { Checkbox, FormControl, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { RoleName } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';

interface UserRolesSelectorProps {
  selectedRoles: RoleName[];
  updateRoles: (roles: RoleName[]) => void;
  disabled?: boolean;
  canAddInternalRoles?: boolean;
}

export const UserRolesSelector = ({
  selectedRoles,
  updateRoles,
  disabled = false,
  canAddInternalRoles = false,
}: UserRolesSelectorProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  return (
    <FormControl
      component="fieldset"
      sx={{ width: '100%' }}
      onChange={(event: ChangeEvent<any>) => {
        const role = event.target.value as RoleName;
        const index = selectedRoles.indexOf(role);
        if (index > -1) {
          updateRoles(selectedRoles.filter((selectedRole) => selectedRole !== role));
        } else {
          updateRoles([...selectedRoles, role]);
        }
      }}
      data-testid={dataTestId.basicData.personAdmin.roleSelector}
      disabled={disabled}>
      <Typography component="legend" variant="h3">
        {t('my_page.my_profile.heading.roles')}
      </Typography>

      <FormGroup sx={{ gap: '0.5rem' }}>
        <FormControlLabel
          disabled
          control={<Checkbox checked={selectedRoles.includes(RoleName.Creator)} value={RoleName.Creator} />}
          label={<RoleLabel title={t('my_page.roles.creator')} description={t('my_page.roles.creator_description')} />}
        />
        <FormControlLabel
          control={<Checkbox checked={selectedRoles.includes(RoleName.Curator)} value={RoleName.Curator} />}
          label={<RoleLabel title={t('my_page.roles.curator')} description={t('my_page.roles.curator_description')} />}
        />
        <FormControlLabel
          control={<Checkbox checked={selectedRoles.includes(RoleName.NviCurator)} value={RoleName.NviCurator} />}
          label={
            <RoleLabel
              title={t('my_page.roles.nvi_curator')}
              description={t('my_page.roles.nvi_curator_description')}
            />
          }
        />
        <FormControlLabel
          control={<Checkbox checked={selectedRoles.includes(RoleName.Editor)} value={RoleName.Editor} />}
          label={<RoleLabel title={t('my_page.roles.editor')} description={t('my_page.roles.editor_description')} />}
        />
        <FormControlLabel
          control={
            <Checkbox checked={selectedRoles.includes(RoleName.InstitutionAdmin)} value={RoleName.InstitutionAdmin} />
          }
          label={
            <RoleLabel
              title={t('my_page.roles.institution_admin')}
              description={t('my_page.roles.institution_admin_description')}
            />
          }
        />
        {user?.isAppAdmin && canAddInternalRoles && (
          <FormGroup sx={{ border: '2px solid', p: '0.5rem', gap: '0.5rem' }}>
            <FormControlLabel
              control={<Checkbox checked={selectedRoles.includes(RoleName.AppAdmin)} value={RoleName.AppAdmin} />}
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
                  checked={selectedRoles.includes(RoleName.InternalImporter)}
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
  );
};

interface RoleLabelProps {
  title: string;
  description: string;
}

const RoleLabel = ({ title, description }: RoleLabelProps) => (
  <>
    <Typography sx={{ fontWeight: 600, lineHeight: '1' }}>{title}</Typography>
    <Typography>{description}</Typography>
  </>
);

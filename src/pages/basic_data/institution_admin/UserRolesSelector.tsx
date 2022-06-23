import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { RoleName } from '../../../types/user.types';

interface UserRolesSelectorProps {
  selectedRoles: RoleName[];
  updateRoles: (roles: RoleName[]) => void;
  disabled?: boolean;
}

export const UserRolesSelector = ({ selectedRoles, updateRoles, disabled = false }: UserRolesSelectorProps) => {
  const { t } = useTranslation('myPage');

  return (
    <FormControl
      component="fieldset"
      onChange={(event: ChangeEvent<any>) => {
        const role = event.target.value as RoleName;
        const index = selectedRoles.indexOf(role);
        if (index > -1) {
          updateRoles(selectedRoles.filter((selectedRole) => selectedRole !== role));
        } else {
          updateRoles([...selectedRoles, role]);
        }
      }}
      disabled={disabled}>
      <FormLabel component="legend">{t('my_profile.heading.roles')}</FormLabel>
      <FormGroup sx={{ gap: '0.5rem' }}>
        <FormControlLabel
          control={<Checkbox checked={selectedRoles.includes(RoleName.Curator)} value={RoleName.Curator} />}
          label={<RoleLabel title={t('roles.curator')} description={t('roles.curator_description')} />}
        />
        <FormControlLabel
          disabled
          control={<Checkbox checked={selectedRoles.includes(RoleName.Creator)} value={RoleName.Creator} />}
          label={<RoleLabel title={t('roles.creator')} description={t('roles.creator_description')} />}
        />
        <FormControlLabel
          control={<Checkbox checked={selectedRoles.includes(RoleName.Editor)} value={RoleName.Editor} />}
          label={<RoleLabel title={t('roles.editor')} description={t('roles.editor_description')} />}
        />
        <FormControlLabel
          control={
            <Checkbox checked={selectedRoles.includes(RoleName.InstitutionAdmin)} value={RoleName.InstitutionAdmin} />
          }
          label={
            <RoleLabel title={t('roles.institution_admin')} description={t('roles.institution_admin_description')} />
          }
        />
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
    <Typography variant="overline" sx={{ fontSize: '0.9rem', lineHeight: '1' }}>
      {title}
    </Typography>
    <Typography>{description}</Typography>
  </>
);

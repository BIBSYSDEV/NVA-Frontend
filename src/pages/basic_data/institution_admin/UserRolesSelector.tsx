import { FormControl, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { RoleName } from '../../../types/user.types';

interface UserRolesSelectorProps {
  selectedRoles: RoleName[];
  updateRoles: (roles: RoleName[]) => void;
  disabled?: boolean;
}

export const UserRolesSelector = ({ selectedRoles, updateRoles, disabled = false }: UserRolesSelectorProps) => {
  const { t } = useTranslation();

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

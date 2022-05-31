import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { RoleName } from '../../../types/user.types';

interface UserRolesSelectorProps {
  selectedRoles: RoleName[];
  updateRoles: (roles: RoleName[]) => void;
  disabled?: boolean;
  disabledRoles?: RoleName[];
}

export const UserRolesSelector = ({
  selectedRoles,
  updateRoles,
  disabled = false,
  disabledRoles = [RoleName.Creator],
}: UserRolesSelectorProps) => {
  const { t } = useTranslation('basicData');

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
      <FormLabel component="legend">{t('profile:heading.roles')}</FormLabel>
      <FormGroup sx={{ gap: '0.5rem' }}>
        <FormControlLabel
          control={<Checkbox checked={selectedRoles.includes(RoleName.Curator)} value={RoleName.Curator} />}
          label={<RoleLabel title={t('profile:roles.curator')} description={t('profile:roles.curator_description')} />}
        />
        <FormControlLabel
          disabled={disabledRoles.includes(RoleName.Creator)}
          control={<Checkbox checked={selectedRoles.includes(RoleName.Creator)} value={RoleName.Creator} />}
          label={<RoleLabel title={t('profile:roles.creator')} description={t('profile:roles.creator_description')} />}
        />
        <FormControlLabel
          control={<Checkbox checked={selectedRoles.includes(RoleName.Editor)} value={RoleName.Editor} />}
          label={<RoleLabel title={t('profile:roles.editor')} description={t('profile:roles.editor_description')} />}
        />
        <FormControlLabel
          control={
            <Checkbox checked={selectedRoles.includes(RoleName.InstitutionAdmin)} value={RoleName.InstitutionAdmin} />
          }
          label={
            <RoleLabel
              title={t('profile:roles.institution_admin')}
              description={t('profile:roles.institution_admin_description')}
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
    <Typography variant="overline" sx={{ fontSize: '0.9rem', lineHeight: '1' }}>
      {title}
    </Typography>
    <Typography>{description}</Typography>
  </>
);

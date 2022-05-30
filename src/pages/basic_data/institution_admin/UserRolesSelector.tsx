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
          label={
            <>
              <Typography variant="overline" sx={{ fontSize: '0.9rem' }}>
                {t('profile:roles.curator')}
              </Typography>
              <Typography>{t('profile:roles.curator_description')}</Typography>
            </>
          }
        />
        <FormControlLabel
          disabled={disabledRoles.includes(RoleName.Creator)}
          control={<Checkbox checked={selectedRoles.includes(RoleName.Creator)} value={RoleName.Creator} />}
          label={
            <>
              <Typography variant="overline" sx={{ fontSize: '0.9rem' }}>
                {t('profile:roles.creator')}
              </Typography>
              <Typography>{t('profile:roles.creator_description')}</Typography>
            </>
          }
        />
        <FormControlLabel
          control={<Checkbox checked={selectedRoles.includes(RoleName.Editor)} value={RoleName.Editor} />}
          label={
            <>
              <Typography variant="overline" sx={{ fontSize: '0.9rem' }}>
                {t('profile:roles.editor')}
              </Typography>
              <Typography>{t('profile:roles.editor_description')}</Typography>
            </>
          }
        />
        <FormControlLabel
          control={
            <Checkbox checked={selectedRoles.includes(RoleName.InstitutionAdmin)} value={RoleName.InstitutionAdmin} />
          }
          label={
            <>
              <Typography variant="overline" sx={{ fontSize: '0.9rem' }}>
                {t('profile:roles.institution_admin')}
              </Typography>
              <Typography>{t('profile:roles.institution_admin_description')}</Typography>
            </>
          }
        />
      </FormGroup>
    </FormControl>
  );
};

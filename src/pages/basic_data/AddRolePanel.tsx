import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import LooksThreeIcon from '@mui/icons-material/Looks3';
import { useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { RoleName } from '../../types/user.types';
import { StyledCenterContainer } from '../../components/styled/Wrappers';

export const AddRolePanel = () => {
  const { t } = useTranslation('basicData');

  const [selectedRoles, setSelectedRoles] = useState([RoleName.CREATOR]);
  const onChangeRoles = (event: ChangeEvent<HTMLInputElement>) => {
    const roleName = event.target.value as RoleName;
    if (selectedRoles.includes(roleName)) {
      setSelectedRoles((state) => state.filter((role) => role !== roleName));
    } else {
      setSelectedRoles((state) => [...state, roleName]);
    }
  };

  return (
    <>
      <StyledCenterContainer>
        <LooksThreeIcon color="primary" fontSize="large" />
      </StyledCenterContainer>
      <FormControl component="fieldset">
        <FormLabel component="legend">{t('profile:heading.roles')}</FormLabel>
        <FormGroup sx={{ gap: '0.5rem' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedRoles.includes(RoleName.CURATOR)}
                onChange={onChangeRoles}
                value={RoleName.CURATOR}
              />
            }
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
            disabled
            control={
              <Checkbox
                checked={selectedRoles.includes(RoleName.CREATOR)}
                onChange={onChangeRoles}
                value={RoleName.CREATOR}
              />
            }
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
            control={
              <Checkbox
                checked={selectedRoles.includes(RoleName.EDITOR)}
                onChange={onChangeRoles}
                value={RoleName.EDITOR}
              />
            }
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
              <Checkbox
                checked={selectedRoles.includes(RoleName.INSTITUTION_ADMIN)}
                onChange={onChangeRoles}
                value={RoleName.INSTITUTION_ADMIN}
              />
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
    </>
  );
};

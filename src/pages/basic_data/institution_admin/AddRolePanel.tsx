import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import LooksThreeIcon from '@mui/icons-material/Looks3';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { RoleName } from '../../../types/user.types';
import { StyledCenterContainer } from '../../../components/styled/Wrappers';
import { AddEmployeeData } from './AddEmployeePage';

export const AddRolePanel = () => {
  const { t } = useTranslation('basicData');
  const { isSubmitting } = useFormikContext<AddEmployeeData>();

  return (
    <FieldArray name="roles">
      {({
        push,
        remove,
        form: {
          values: { roles },
        },
      }: FieldArrayRenderProps) => (
        <>
          <StyledCenterContainer>
            <LooksThreeIcon color="primary" fontSize="large" />
          </StyledCenterContainer>
          <FormControl
            component="fieldset"
            onChange={(event: ChangeEvent<any>) => {
              const role = event.target.value as RoleName;
              const index = roles.indexOf(role);
              if (index > -1) {
                remove(index);
              } else {
                push(role);
              }
            }}
            disabled={isSubmitting}>
            <FormLabel component="legend">{t('profile:heading.roles')}</FormLabel>
            <FormGroup sx={{ gap: '0.5rem' }}>
              <FormControlLabel
                control={<Checkbox checked={roles.includes(RoleName.Curator)} value={RoleName.Curator} />}
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
                control={<Checkbox checked={roles.includes(RoleName.Creator)} value={RoleName.Creator} />}
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
                control={<Checkbox checked={roles.includes(RoleName.Editor)} value={RoleName.Editor} />}
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
                  <Checkbox checked={roles.includes(RoleName.InstitutionAdmin)} value={RoleName.InstitutionAdmin} />
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
      )}
    </FieldArray>
  );
};

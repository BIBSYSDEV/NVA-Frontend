import { Typography, Box, Divider, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Form, Formik } from 'formik';
import { FlatCristinUser, RoleName } from '../../types/user.types';
import { FindPersonPanel } from './FindPersonPanel';
import { AddAffiliationPanel } from './AddAffiliationPanel';
import { AddRolePanel } from './AddRolePanel';
import { StyledCenterContainer } from '../../components/styled/Wrappers';

export interface AddEmployeeData {
  user: FlatCristinUser;
  affiliation: any;
  roles: RoleName[];
}

export const emptyUser: FlatCristinUser = {
  nationalId: '',
  firstName: '',
  lastName: '',
  id: '',
  cristinIdentifier: '',
};

const initialValues: AddEmployeeData = {
  user: emptyUser,
  affiliation: null,
  roles: [RoleName.CREATOR],
};

export const AddEmployee = () => {
  const { t } = useTranslation('basicData');

  const onSubmit = (values: AddEmployeeData) => {
    console.log(values);
  };

  return (
    <>
      <Typography variant="h3" component="h2" paragraph>
        {t('add_to_your_person_registry')}
      </Typography>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: '2rem', mt: '2rem' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <FindPersonPanel />
            </Box>
            <Divider orientation="vertical" />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AddAffiliationPanel />
            </Box>
            <Divider orientation="vertical" />
            <Box>
              <AddRolePanel />
            </Box>
          </Box>
          <StyledCenterContainer>
            <Button variant="contained" size="large" type="submit">
              {t('common:create')}
            </Button>
          </StyledCenterContainer>
        </Form>
      </Formik>
    </>
  );
};

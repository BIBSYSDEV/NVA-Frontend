import { Typography, Box, Divider, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Form, Formik } from 'formik';
import { FlatCristinUser, RoleName } from '../../types/user.types';
import { FindPersonPanel } from './FindPersonPanel';
import { AddAffiliationPanel } from './AddAffiliationPanel';
import { AddRolePanel } from './AddRolePanel';
import { StyledCenterContainer } from '../../components/styled/Wrappers';

interface Employment {
  type: string;
  organization: string;
  startDate: string;
  endDate: string;
  fullTimeEquivalentPercentage: string;
}

export interface AddEmployeeData {
  user: FlatCristinUser;
  affiliation: Employment;
  roles: RoleName[];
}

export const emptyUser: FlatCristinUser = {
  nationalId: '',
  firstName: '',
  lastName: '',
  id: '',
  cristinIdentifier: '',
  affiliations: [],
};

const initialValues: AddEmployeeData = {
  user: emptyUser,
  affiliation: { type: '', organization: '', startDate: '', endDate: '', fullTimeEquivalentPercentage: '' },
  roles: [RoleName.CREATOR],
};

export const AddEmployee = () => {
  const { t } = useTranslation('basicData');

  const onSubmit = (values: AddEmployeeData) => {
    console.log('Submit:', values);

    // TODO:
    if (!values.user.id) {
      // Create user if it does not exist
    } else {
      // Add affiliation
    }

    // Add roles
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

import { Typography, Box, Divider, styled, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FlatCristinUser, RoleName } from '../../types/user.types';
import { FindPersonPanel } from './FindPersonPanel';
import { AddAffiliationPanel } from './AddAffiliationPanel';
import { AddRolePanel } from './AddRolePanel';

interface AddEmployeeData {
  user: FlatCristinUser;
  affiliation: any;
  roles: RoleName[];
}

const initialValues: AddEmployeeData = {
  user: { nationalId: '', firstName: '', lastName: '' },
  affiliation: null,
  roles: [RoleName.CREATOR],
};

const StyledCenterContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-around',
});

export const AddEmployee = () => {
  const { t } = useTranslation('basicData');

  return (
    <>
      <Typography variant="h3" component="h2" paragraph>
        {t('add_to_your_person_registry')}
      </Typography>
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
        <Button variant="contained" size="large" disabled>
          {t('common:create')}
        </Button>
      </StyledCenterContainer>
    </>
  );
};

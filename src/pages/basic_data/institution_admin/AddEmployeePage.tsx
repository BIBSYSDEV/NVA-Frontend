import { Typography, Box, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikProps } from 'formik';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'react-redux';
import { CreateCristinUser, CristinUser, FlatCristinUser, RoleName } from '../../../types/user.types';
import { FindPersonPanel } from './FindPersonPanel';
import { AddAffiliationPanel } from './AddAffiliationPanel';
import { AddRolePanel } from './AddRolePanel';
import { StyledCenterContainer } from '../../../components/styled/Wrappers';
import { authenticatedApiRequest } from '../../../api/apiRequest';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { setNotification } from '../../../redux/actions/notificationActions';
import { CristinApiPath } from '../../../api/apiPaths';
import { convertToCristinUser } from '../../../utils/user-helpers';
import { addEmployeeValidationSchema } from '../../../utils/validation/basic_data/addEmployeeValidation';

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

export const AddEmployeePage = () => {
  const { t } = useTranslation('basicData');
  const disaptch = useDispatch();

  const onSubmit = async (values: AddEmployeeData) => {
    let userId = values.user.id;

    if (!userId) {
      // Create user if it does not yet exist in Cristin
      const cristinUser: CreateCristinUser = convertToCristinUser(values.user);
      const createPersonResponse = await authenticatedApiRequest<CristinUser>({
        url: CristinApiPath.Person,
        method: 'POST',
        data: cristinUser,
      });
      if (isErrorStatus(createPersonResponse.status)) {
        disaptch(setNotification(t('feedback:error.add_employment'), 'error'));
      } else if (isSuccessStatus(createPersonResponse.status)) {
        userId = createPersonResponse.data.id;
      }
    }

    if (userId) {
      // Add employment (affiliation)
      const addAffiliationResponse = await authenticatedApiRequest<Employment>({
        url: `${userId}/employment`,
        method: 'POST',
        data: values.affiliation,
      });
      if (isSuccessStatus(addAffiliationResponse.status)) {
        disaptch(setNotification(t('feedback:success.add_employment')));
      } else if (isErrorStatus(addAffiliationResponse.status)) {
        disaptch(setNotification(t('feedback:error.add_employment'), 'error'));
      }
    }

    // TODO: Add roles? This will lead to two ways of creating user: login and by admin here
  };

  return (
    <>
      <Typography variant="h3" component="h2" paragraph>
        {t('add_to_your_person_registry')}
      </Typography>
      <Formik initialValues={initialValues} validationSchema={addEmployeeValidationSchema} onSubmit={onSubmit}>
        {({ isValid, isSubmitting }: FormikProps<AddEmployeeData>) => (
          <Form noValidate>
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
              <LoadingButton variant="contained" size="large" loading={isSubmitting} disabled={!isValid} type="submit">
                {t('common:create')}
              </LoadingButton>
            </StyledCenterContainer>
          </Form>
        )}
      </Formik>
    </>
  );
};

import { Typography, Box, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { CreateCristinUser, Employment, FlatCristinUser, RoleName } from '../../../types/user.types';
import { FindPersonPanel } from './FindPersonPanel';
import { AddAffiliationPanel } from './AddAffiliationPanel';
import { AddRolePanel } from './AddRolePanel';
import { StyledCenterContainer } from '../../../components/styled/Wrappers';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { setNotification } from '../../../redux/notificationSlice';
import { convertToCristinUser } from '../../../utils/user-helpers';
import { addEmployeeValidationSchema } from '../../../utils/validation/basic_data/addEmployeeValidation';
import { addEmployment, createCristinPerson } from '../../../api/userApi';
import { createUser } from '../../../api/roleApi';
import { RootState } from '../../../redux/store';

export interface AddEmployeeData {
  searchIdNumber: string;
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
  searchIdNumber: '',
  user: emptyUser,
  affiliation: { type: '', organization: '', startDate: '', endDate: '', fullTimeEquivalentPercentage: '' },
  roles: [RoleName.Creator],
};

export const AddEmployeePage = () => {
  const { t } = useTranslation('basicData');
  const dispatch = useDispatch();
  const customerId = useSelector((store: RootState) => store.user?.customerId);

  const onSubmit = async (values: AddEmployeeData, { resetForm }: FormikHelpers<AddEmployeeData>) => {
    if (!customerId) {
      return;
    }

    let userId = values.user.id;

    if (!userId) {
      // Create user if it does not yet exist in Cristin
      const cristinUser: CreateCristinUser = convertToCristinUser(values.user);
      const createPersonResponse = await createCristinPerson(cristinUser);
      if (isErrorStatus(createPersonResponse.status)) {
        dispatch(setNotification({ message: t('feedback:error.create_user'), variant: 'error' }));
      } else if (isSuccessStatus(createPersonResponse.status)) {
        userId = createPersonResponse.data.id;
      }
    }

    if (userId) {
      // Add employment (affiliation)
      const addAffiliationResponse = await addEmployment(userId, values.affiliation);
      if (isSuccessStatus(addAffiliationResponse.status)) {
        // Create NVA User with roles
        await new Promise((resolve) => setTimeout(resolve, 10_000)); // Wait 10sec before creating NVA User. TODO: NP-9121
        const createUserResponse = await createUser({
          nationalIdentityNumber: values.searchIdNumber,
          customerId,
          roles: values.roles.map((role) => ({ type: 'Role', rolename: role })),
        });
        if (isSuccessStatus(createUserResponse.status)) {
          dispatch(setNotification({ message: t('feedback:success.add_employment'), variant: 'success' }));
          resetForm();
        } else if (isErrorStatus(createUserResponse.status)) {
          dispatch(setNotification({ message: t('feedback:error.add_role'), variant: 'error' }));
        }
      } else if (isErrorStatus(addAffiliationResponse.status)) {
        dispatch(setNotification({ message: t('feedback:error.add_employment'), variant: 'error' }));
      }
    }
  };

  return (
    <>
      <Typography variant="h3" component="h2" paragraph>
        {t('add_to_person_registry')}
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

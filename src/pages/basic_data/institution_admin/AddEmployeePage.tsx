import { Typography, Box, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import LooksThreeIcon from '@mui/icons-material/LooksTwoOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CreateCristinPerson, Employment, FlatCristinPerson, RoleName } from '../../../types/user.types';
import { FindPersonPanel } from './FindPersonPanel';
import { AddAffiliationPanel } from './AddAffiliationPanel';
import { StyledCenterContainer } from '../../../components/styled/Wrappers';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { setNotification } from '../../../redux/notificationSlice';
import { convertToCristinPerson } from '../../../utils/user-helpers';
import { addEmployeeValidationSchema } from '../../../utils/validation/basic_data/addEmployeeValidation';
import { addEmployment, createCristinPerson } from '../../../api/userApi';
import { createUser } from '../../../api/roleApi';
import { RootState } from '../../../redux/store';
import { UserRolesSelector } from './UserRolesSelector';

export interface AddEmployeeData {
  user: FlatCristinPerson;
  affiliation: Employment;
  roles: RoleName[];
}

export const emptyUser: FlatCristinPerson = {
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
      const cristinUser: CreateCristinPerson = convertToCristinPerson(values.user);
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
          nationalIdentityNumber: values.user.nationalId,
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
      <Helmet>
        <title>{t('add_employee.add_employee')}</title>
      </Helmet>
      <Typography variant="h3" component="h2" paragraph>
        {t('add_employee.add_to_person_registry')}
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={addEmployeeValidationSchema}
        onSubmit={onSubmit}
        validateOnMount>
        {({ isValid, isSubmitting, values, setFieldValue, errors }: FormikProps<AddEmployeeData>) => (
          <Form noValidate>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr auto 1fr' },
                gap: '1rem',
                mt: '2rem',
              }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <FindPersonPanel />
              </Box>
              <Divider orientation="vertical" />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <AddAffiliationPanel />
              </Box>
              <Divider orientation="vertical" />
              <Box>
                <StyledCenterContainer>
                  <LooksThreeIcon color="primary" fontSize="large" />
                </StyledCenterContainer>
                <UserRolesSelector
                  selectedRoles={values.roles}
                  updateRoles={(newRoles) => setFieldValue('roles', newRoles)}
                  disabled={isSubmitting || !!errors.user || !!errors.affiliation}
                />
              </Box>
            </Box>
            <StyledCenterContainer sx={{ mt: '1rem' }}>
              <LoadingButton
                variant="contained"
                size="large"
                loading={isSubmitting}
                disabled={!isValid}
                type="submit"
                startIcon={<AddCircleOutlineIcon />}>
                {t('translations:common.create')}
              </LoadingButton>
            </StyledCenterContainer>
          </Form>
        )}
      </Formik>
    </>
  );
};

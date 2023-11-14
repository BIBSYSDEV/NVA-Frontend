import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { LoadingButton } from '@mui/lab';
import { Box, Divider, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { addEmployment, createCristinPerson } from '../../../api/cristinApi';
import { createUser } from '../../../api/roleApi';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import {
  CreateCristinPerson,
  Employment,
  FlatCristinPerson,
  RoleName,
  emptyEmployment,
  emptyNviVerification,
} from '../../../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { convertToCristinPerson } from '../../../utils/user-helpers';
import { addEmployeeValidationSchema } from '../../../utils/validation/basic_data/addEmployeeValidation';
import { AddAffiliationPanel } from './AddAffiliationPanel';
import { FindPersonPanel } from './FindPersonPanel';
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
  employments: [],
  background: {},
  keywords: [],
  nvi: emptyNviVerification,
};

const initialValues: AddEmployeeData = {
  user: emptyUser,
  affiliation: emptyEmployment,
  roles: [RoleName.Creator],
};

export const AddEmployeePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const customerId = useSelector((store: RootState) => store.user?.customerId);

  const onSubmit = async (values: AddEmployeeData, { resetForm, validateForm }: FormikHelpers<AddEmployeeData>) => {
    if (!customerId) {
      return;
    }

    let personId = values.user.id;
    const nationalId = values.user.nationalId;
    const { nvi, ...personWithoutNvi } = values.user;

    if (!personId) {
      const person = nationalId ? personWithoutNvi : values.user;
      // Create Person if it does not yet exist in Cristin
      const cristinPerson: CreateCristinPerson = convertToCristinPerson({
        ...person,
        employments: [values.affiliation],
      });
      const createPersonResponse = await createCristinPerson(cristinPerson);
      if (isErrorStatus(createPersonResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.create_user'), variant: 'error' }));
      } else if (isSuccessStatus(createPersonResponse.status)) {
        if (!nationalId) {
          dispatch(setNotification({ message: t('feedback.success.create_person'), variant: 'success' }));
          resetForm();
        } else {
          personId = createPersonResponse.data.id;
          await new Promise((resolve) => setTimeout(resolve, 10_000)); // Wait 10sec before creating NVA User. TODO: NP-9121
        }
      }
    } else {
      // Add employment to existing Person
      const addAffiliationResponse = await addEmployment(personId, values.affiliation);
      if (isErrorStatus(addAffiliationResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.add_employment'), variant: 'error' }));
      }
    }

    if (personId && nationalId) {
      // Create NVA User with roles
      const createUserResponse = await createUser({
        nationalIdentityNumber: values.user.nationalId,
        customerId,
        roles: values.roles.map((role) => ({ type: 'Role', rolename: role })),
      });
      if (isSuccessStatus(createUserResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.add_employment'), variant: 'success' }));
        resetForm();
        validateForm();
      } else if (isErrorStatus(createUserResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.add_role'), variant: 'error' }));
      }
    }
  };

  return (
    <BackgroundDiv>
      <Helmet>
        <title>{t('basic_data.add_employee.add_employee')}</title>
      </Helmet>
      <Typography variant="h2">{t('basic_data.add_employee.update_person_registry')}</Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={addEmployeeValidationSchema}
        onSubmit={onSubmit}
        validateOnMount>
        {({ isSubmitting, values, setFieldValue, errors }: FormikProps<AddEmployeeData>) => (
          <Form noValidate>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' },
                gap: '1rem',
                mt: '2rem',
              }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <FindPersonPanel />
              </Box>
              <Divider orientation="vertical" />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <AddAffiliationPanel />
                <UserRolesSelector
                  selectedRoles={values.roles}
                  updateRoles={(newRoles) => setFieldValue('roles', newRoles)}
                  disabled={isSubmitting || !!errors.user || !!errors.affiliation || !values.user.nationalId}
                />
              </Box>
            </Box>
            <Box sx={{ mt: '2rem', display: 'flex', justifyContent: 'end' }}>
              <LoadingButton
                variant="contained"
                size="large"
                loading={isSubmitting}
                type="submit"
                startIcon={<AddCircleOutlineIcon />}>
                {t('common.create')}
              </LoadingButton>
            </Box>
          </Form>
        )}
      </Formik>
    </BackgroundDiv>
  );
};

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
  emptyPerson,
} from '../../../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { convertToCristinPerson } from '../../../utils/user-helpers';
import { addEmployeeValidationSchema } from '../../../utils/validation/basic_data/addEmployeeValidation';
import { AddAffiliationSection } from './AddAffiliationSection';
import { FindPersonPanel } from './FindPersonPanel';
import { RolesFormSection } from './edit_user/RolesFormSection';
import { TasksFormSection, rolesWithAreaOfResponsibility } from './edit_user/TasksFormSection';

export interface AddEmployeeData {
  person: FlatCristinPerson;
  affiliation: Employment;
  roles: RoleName[];
  viewingScopes: string[];
}

const initialValues: AddEmployeeData = {
  person: emptyPerson,
  affiliation: emptyEmployment,
  roles: [RoleName.Creator],
  viewingScopes: [],
};

export const AddEmployeePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const customerId = useSelector((store: RootState) => store.user?.customerId);
  const topOrgCristinId = useSelector((store: RootState) => store.user?.topOrgCristinId);

  const onSubmit = async (values: AddEmployeeData, { resetForm, validateForm }: FormikHelpers<AddEmployeeData>) => {
    if (!customerId) {
      return;
    }

    let personId = values.person.id;
    const nationalId = values.person.nationalId;
    const { nvi, ...personWithoutNvi } = values.person;

    if (!personId) {
      const person = nationalId ? personWithoutNvi : values.person;
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
      } else if (isSuccessStatus(addAffiliationResponse.status) && !nationalId) {
        dispatch(setNotification({ message: t('feedback.success.add_employment'), variant: 'success' }));
        resetForm();
      }
    }

    if (personId && nationalId) {
      // Create NVA User with roles
      const createUserResponse = await createUser({
        cristinIdentifier: values.person.cristinIdentifier,
        customerId,
        roles: values.roles.map((role) => ({ type: 'Role', rolename: role })),
        viewingScope: {
          type: 'ViewingScope',
          includedUnits: values.viewingScopes,
        },
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
        {({ isSubmitting, values, setFieldValue, errors, isValid }: FormikProps<AddEmployeeData>) => (
          <Form noValidate>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1fr auto 1fr auto 1fr auto 1fr' },
                gap: '1rem',
                mt: '2rem',
              }}>
              <FindPersonPanel />
              <Divider orientation="vertical" />
              <AddAffiliationSection />
              <Divider orientation="vertical" />
              <RolesFormSection
                personHasNin={!values.person.nvi?.verifiedAt.id}
                roles={values.roles}
                updateRoles={(newRoles) => {
                  if (!newRoles.includes(RoleName.PublishingCurator)) {
                    newRoles = newRoles.filter(
                      (role) => role !== RoleName.CuratorThesis && role !== RoleName.CuratorThesisEmbargo
                    );
                  }

                  setFieldValue('roles', newRoles);
                  const hasCuratorRole = newRoles.some((role) => rolesWithAreaOfResponsibility.includes(role));
                  if (hasCuratorRole && values.viewingScopes.length === 0 && topOrgCristinId) {
                    setFieldValue('viewingScopes', [topOrgCristinId]);
                  } else if (!hasCuratorRole) {
                    setFieldValue('viewingScopes', []);
                  }
                }}
                disabled={isSubmitting || !!errors.person || !!errors.affiliation}
              />
              <Divider orientation="vertical" />
              <TasksFormSection
                roles={values.roles}
                viewingScopes={values.viewingScopes}
                updateViewingScopes={(newViewingScopes) => setFieldValue('viewingScopes', newViewingScopes)}
                updateRoles={(newRoles) => setFieldValue('roles', newRoles)}
              />
            </Box>
            <Box sx={{ mt: '2rem', display: 'flex', justifyContent: 'center' }}>
              <LoadingButton
                variant="contained"
                size="large"
                disabled={!isValid}
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

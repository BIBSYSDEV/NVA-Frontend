import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Button, Divider, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { addEmployment, createCristinPerson } from '../../../api/cristinApi';
import { createUser } from '../../../api/roleApi';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import {
  CreateCristinPerson,
  Employment,
  emptyEmployment,
  emptyPerson,
  FlatCristinPerson,
  RoleName,
} from '../../../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { convertToCristinPerson } from '../../../utils/user-helpers';
import { addEmployeeValidationSchema } from '../../../utils/validation/basic_data/addEmployeeValidation';
import { AddAffiliationSection } from './AddAffiliationSection';
import { RolesFormSection } from './edit_user/RolesFormSection';
import { rolesWithAreaOfResponsibility, TasksFormSection } from './edit_user/TasksFormSection';
import { FindPersonPanel } from './FindPersonPanel';

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
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const customerId = useSelector((store: RootState) => store.user?.customerId);
  const topOrgCristinId = useSelector((store: RootState) => store.user?.topOrgCristinId);

  const onSubmit = async (values: AddEmployeeData, { resetForm }: FormikHelpers<AddEmployeeData>) => {
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
      const cristinIdentifier = values.person.cristinIdentifier || getIdentifierFromId(personId);
      const createUserResponse = await createUser({
        cristinIdentifier,
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
      } else if (isErrorStatus(createUserResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.add_role'), variant: 'error' }));
      }
    }
    setOpenConfirmationDialog(false);
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
        {({ submitForm, isSubmitting, values, setFieldValue, errors, isValid }: FormikProps<AddEmployeeData>) => {
          return (
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
                <Button
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                  loadingPosition="start"
                  disabled={!isValid}
                  onClick={() => {
                    const shouldShowConfirmDialog = !values.person.id; // Only confirm consent when creating a new user
                    if (shouldShowConfirmDialog) {
                      setOpenConfirmationDialog(true);
                    } else {
                      submitForm();
                    }
                  }}
                  startIcon={<AddCircleOutlineIcon />}>
                  {t('common.create')}
                </Button>
              </Box>
              <ConfirmDialog
                open={openConfirmationDialog}
                title={t('basic_data.add_employee.have_you_informed')}
                onAccept={() => {
                  submitForm();
                }}
                isLoading={isSubmitting}
                onCancel={() => setOpenConfirmationDialog(false)}
                dialogDataTestId={dataTestId.basicData.addEmployeeConfirmWindow}>
                <Trans
                  i18nKey="basic_data.add_employee.have_you_informed_description"
                  components={[<Typography key="1" gutterBottom />]}
                />
                <Typography>{t('basic_data.add_employee.have_you_informed_confirmation_text')}</Typography>
              </ConfirmDialog>
            </Form>
          );
        }}
      </Formik>
    </BackgroundDiv>
  );
};

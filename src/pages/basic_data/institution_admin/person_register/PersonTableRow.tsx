import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TableRow,
  TableCell,
  Tooltip,
  IconButton,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Divider,
  Typography,
  CircularProgress,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CancelIcon from '@mui/icons-material/Cancel';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import OrcidLogo from '../../../../resources/images/orcid_logo.svg';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { isErrorStatus, isSuccessStatus, ORCID_BASE_URL } from '../../../../utils/constants';
import {
  convertToFlatCristinPerson,
  getMaskedNationalIdentityNumber,
  isActiveEmployment,
} from '../../../../utils/user-helpers';
import { CristinPerson, Employment, emptyEmployment, InstitutionUser, RoleName } from '../../../../types/user.types';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { CristinApiPath, RoleApiPath } from '../../../../api/apiPaths';
import { UserRolesSelector } from '../UserRolesSelector';
import { authenticatedApiRequest } from '../../../../api/apiRequest';
import { setNotification } from '../../../../redux/notificationSlice';
import { createUser } from '../../../../api/roleApi';
import { PositionField } from '../../fields/PositionField';
import { StartDateField } from '../../fields/StartDateField';
import { personDataValidationSchema } from '../../../../utils/validation/basic_data/addEmployeeValidation';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { RootState } from '../../../../redux/store';

export interface PersonData {
  employments: Employment[];
  roles: RoleName[];
}

interface PersonTableRowProps {
  cristinPerson: CristinPerson;
  topOrgCristinIdentifier: string;
  customerId: string;
  refetchEmployees: () => void;
}

export const PersonTableRow = ({
  cristinPerson,
  topOrgCristinIdentifier,
  customerId,
  refetchEmployees,
}: PersonTableRowProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const reduxResources = useSelector((store: RootState) => store.resources);
  const [openDialog, setOpenDialog] = useState(false);
  const toggleDialog = () => setOpenDialog(!openDialog);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const toggleConfirmDeleteDialog = () => setOpenConfirmDeleteDialog(!openConfirmDeleteDialog);
  const [employmentIndex, setEmploymentIndex] = useState(0);
  const [showFullNin, setShowFullNin] = useState(false);

  const hasFetchedPositions = Object.keys(reduxResources).some((id) => id.endsWith(CristinApiPath.Position));

  const { cristinIdentifier, firstName, lastName, employments, orcid, nationalId } =
    convertToFlatCristinPerson(cristinPerson);
  const orcidUrl = orcid ? `${ORCID_BASE_URL}/${orcid}` : '';

  const username = `${cristinIdentifier}@${topOrgCristinIdentifier}`;
  const [institutionUser, isLoadingInstitutionUser] = useFetch<InstitutionUser>({
    url: openDialog ? `${RoleApiPath.Users}/${username}` : '',
    withAuthentication: true,
    errorMessage: false,
  });

  const activeEmployments = employments.filter(isActiveEmployment);
  const employmentsInThisInstitution: Employment[] = [];
  const employmentsInOtherInstitutions: Employment[] = [];
  const targetOrganizationIdStart = `${topOrgCristinIdentifier?.split('.')[0]}.`;

  employments.forEach((employment) => {
    const organizationIdentifier = employment.organization.split('/').pop();
    if (organizationIdentifier?.startsWith(targetOrganizationIdStart)) {
      employmentsInThisInstitution.push(employment);
    } else {
      employmentsInOtherInstitutions.push(employment);
    }
  });

  const updatePersonAndRoles = async (values: PersonData) => {
    // Update Cristin Person
    const updatedPerson: CristinPerson = {
      ...cristinPerson,
      employments: values.employments,
    };
    const updateCristinPerson = await authenticatedApiRequest({
      url: cristinPerson.id,
      method: 'PATCH',
      data: updatedPerson,
    });
    if (isSuccessStatus(updateCristinPerson.status)) {
      // Update NVA User
      let updateUserResponse;
      if (institutionUser) {
        const updatedInstitutionUser: InstitutionUser = {
          ...institutionUser,
          roles: values.roles.map((role) => ({ type: 'Role', rolename: role })),
        };

        updateUserResponse = await authenticatedApiRequest<null>({
          url: `${RoleApiPath.Users}/${username}`,
          method: 'PUT',
          data: updatedInstitutionUser,
        });
      } else {
        updateUserResponse = await createUser({
          nationalIdentityNumber: nationalId,
          customerId,
          roles: values.roles.map((role) => ({ type: 'Role', rolename: role })),
        });
      }
      if (isSuccessStatus(updateUserResponse.status)) {
        refetchEmployees();
        dispatch(setNotification({ message: t('feedback.success.update_institution_user'), variant: 'success' }));
      } else if (isErrorStatus(updateUserResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.update_institution_user'), variant: 'error' }));
      }
    } else {
      dispatch(setNotification({ message: t('feedback.error.update_person'), variant: 'error' }));
    }
  };

  const initialValues: PersonData = {
    roles: institutionUser ? institutionUser.roles.map((role) => role.rolename) : [RoleName.Creator],
    employments: employmentsInThisInstitution.map((employment) => ({ ...emptyEmployment, ...employment })),
  };

  const employmentBaseFieldName = `employments[${employmentIndex}]`;

  return (
    <>
      <TableRow onClick={toggleDialog} sx={{ cursor: 'pointer' }}>
        <TableCell>{cristinIdentifier}</TableCell>
        <TableCell>{getMaskedNationalIdentityNumber(nationalId)}</TableCell>
        <TableCell width="25%">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>
              {firstName} {lastName}
            </Typography>
            {orcidUrl && (
              <Tooltip title={t('common.orcid_profile')}>
                <IconButton size="small" href={orcidUrl} target="_blank">
                  <img src={OrcidLogo} height="20" alt="orcid" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </TableCell>
        <TableCell width="60%">
          <Box component="ul" sx={{ p: 0 }}>
            {activeEmployments.map((employment, index) => (
              <Box key={`${employment.organization}-${index}`} component="li" sx={{ display: 'flex' }}>
                <AffiliationHierarchy unitUri={employment.organization} commaSeparated />
              </Box>
            ))}
          </Box>
        </TableCell>
        <TableCell>
          <Tooltip title={t('common.edit')}>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <Dialog open={openDialog} onClose={toggleDialog} maxWidth="md" fullWidth transitionDuration={{ exit: 0 }}>
        <DialogTitle>
          <span id="edit-person-label">{t('basic_data.person_register.edit_person')}</span>
        </DialogTitle>
        <Formik
          initialValues={initialValues}
          enableReinitialize // Needed to update roles values when the institutionUser is recieved
          onSubmit={updatePersonAndRoles}
          validationSchema={personDataValidationSchema}>
          {({ values, isSubmitting, setFieldValue, errors, touched }: FormikProps<PersonData>) => (
            <Form noValidate>
              <DialogContent>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <TextField variant="filled" disabled value={firstName} label={t('common.first_name')} />
                    <TextField variant="filled" disabled value={lastName} label={t('common.last_name')} />
                    <TextField
                      variant="filled"
                      disabled
                      value={showFullNin ? nationalId : getMaskedNationalIdentityNumber(nationalId)}
                      label={t('basic_data.person_register.national_identity_number')}
                      InputProps={{
                        endAdornment: (
                          <Tooltip
                            title={
                              showFullNin
                                ? t('basic_data.person_register.hide_full_nin')
                                : t('basic_data.person_register.show_full_nin')
                            }>
                            <IconButton onClick={() => setShowFullNin((prevShowFullNin) => !prevShowFullNin)}>
                              {showFullNin ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                    {orcid && <TextField variant="filled" disabled value={orcid} label={t('common.orcid')} />}
                    {employmentsInOtherInstitutions.some(isActiveEmployment) && (
                      <div>
                        <Typography variant="overline">{t('basic_data.person_register.other_employments')}</Typography>
                        <Box component="ul" sx={{ my: 0, pl: '1rem' }}>
                          {employmentsInOtherInstitutions.filter(isActiveEmployment).map((affiliation) => (
                            <li key={affiliation.organization}>
                              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                                <AffiliationHierarchy unitUri={affiliation.organization} commaSeparated />
                              </Box>
                            </li>
                          ))}
                        </Box>
                      </div>
                    )}
                  </Box>
                  <Divider flexItem orientation="vertical" />
                  {isLoadingInstitutionUser ? (
                    <CircularProgress sx={{ margin: 'auto' }} aria-labelledby="edit-person-label" />
                  ) : (
                    values.employments.length > 0 && (
                      <div>
                        <Typography variant="overline" gutterBottom>
                          {t('common.employments')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <Field name={`${employmentBaseFieldName}.organization`}>
                            {({ field }: FieldProps<string>) => (
                              <AffiliationHierarchy unitUri={field.value} commaSeparated />
                            )}
                          </Field>

                          <Box display={{ display: 'flex', gap: '1rem' }}>
                            <PositionField
                              fieldName={`${employmentBaseFieldName}.type`}
                              disabled={isSubmitting || !hasFetchedPositions}
                              includeDisabledPositions
                            />

                            <Field name={`${employmentBaseFieldName}.fullTimeEquivalentPercentage`}>
                              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                                <TextField
                                  {...field}
                                  value={field.value ?? ''}
                                  required
                                  disabled={isSubmitting || !hasFetchedPositions}
                                  fullWidth
                                  type="number"
                                  inputProps={{ min: '0', max: '100' }}
                                  variant="filled"
                                  label={t('basic_data.add_employee.position_percent')}
                                  error={touched && !!error}
                                  helperText={touched && error}
                                />
                              )}
                            </Field>
                          </Box>
                          <Box display={{ display: 'flex', gap: '1rem' }}>
                            <StartDateField
                              fieldName={`${employmentBaseFieldName}.startDate`}
                              disabled={isSubmitting || !hasFetchedPositions}
                              maxDate={
                                values.employments[employmentIndex].endDate
                                  ? new Date(values.employments[employmentIndex].endDate)
                                  : undefined
                              }
                            />

                            <Field name={`${employmentBaseFieldName}.endDate`}>
                              {({ field, meta: { error, touched } }: FieldProps<string>) => (
                                <DatePicker
                                  disabled={isSubmitting || !hasFetchedPositions}
                                  label={t('common.end_date')}
                                  PopperProps={{
                                    'aria-label': t('common.end_date'),
                                  }}
                                  value={field.value ? field.value : null}
                                  onChange={(date) => setFieldValue(field.name, date ?? '')}
                                  inputFormat="dd.MM.yyyy"
                                  views={['year', 'month', 'day']}
                                  mask="__.__.____"
                                  minDate={
                                    values.employments[employmentIndex].startDate
                                      ? new Date(values.employments[employmentIndex].startDate)
                                      : undefined
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="filled"
                                      error={touched && !!error}
                                      helperText={<ErrorMessage name={field.name} />}
                                    />
                                  )}
                                />
                              )}
                            </Field>
                          </Box>
                          <Button
                            disabled={isSubmitting || !hasFetchedPositions}
                            color="error"
                            variant="outlined"
                            onClick={toggleConfirmDeleteDialog}
                            endIcon={<CancelIcon />}>
                            {t('basic_data.person_register.remove_employment')}
                          </Button>
                          {values.employments.length > 1 && (
                            <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', alignSelf: 'center' }}>
                              <IconButton
                                title={t('common.previous')}
                                disabled={employmentIndex === 0}
                                onClick={() => setEmploymentIndex(employmentIndex - 1)}>
                                <NavigateBeforeIcon />
                              </IconButton>
                              <Typography>
                                {t('basic_data.person_register.employment_x_of_y', {
                                  selected: employmentIndex + 1,
                                  total: values.employments.length,
                                })}
                              </Typography>
                              <IconButton
                                title={t('common.next')}
                                disabled={employmentIndex === values.employments.length - 1}
                                onClick={() => setEmploymentIndex(employmentIndex + 1)}>
                                <NavigateNextIcon />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                        {!!errors.employments && touched.employments && (
                          <Typography color="error">{t('feedback.validation.employments_missing_data')}</Typography>
                        )}

                        <Box sx={{ mt: '1rem' }}>
                          <UserRolesSelector
                            selectedRoles={values.roles}
                            updateRoles={(newRoles) => setFieldValue('roles', newRoles)}
                            disabled={isSubmitting || !hasFetchedPositions}
                          />
                        </Box>
                      </div>
                    )
                  )}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={toggleDialog}>{t('common.cancel')}</Button>
                <LoadingButton
                  loading={isSubmitting}
                  disabled={isLoadingInstitutionUser || !hasFetchedPositions}
                  variant="contained"
                  type="submit">
                  {t('common.save')}
                </LoadingButton>
              </DialogActions>
              <ConfirmDialog
                open={openConfirmDeleteDialog}
                title={t('basic_data.person_register.remove_employment_title')}
                onAccept={() => {
                  const filteredEmployments = values.employments.filter((_, index) => index !== employmentIndex);
                  setFieldValue('employments', filteredEmployments);
                  setEmploymentIndex(employmentIndex !== 0 ? employmentIndex - 1 : 0);
                  toggleConfirmDeleteDialog();
                }}
                onCancel={toggleConfirmDeleteDialog}>
                <Typography>{t('basic_data.person_register.remove_employment_text')}</Typography>
              </ConfirmDialog>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

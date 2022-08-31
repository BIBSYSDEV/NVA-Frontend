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
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EditIcon from '@mui/icons-material/Edit';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import OrcidLogo from '../../../../resources/images/orcid_logo.svg';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { isErrorStatus, isSuccessStatus, ORCID_BASE_URL } from '../../../../utils/constants';
import {
  convertToFlatCristinPerson,
  getMaskedNationalIdentityNumber,
  isActiveEmployment,
} from '../../../../utils/user-helpers';
import { CristinPerson, Employment, InstitutionUser, RoleName } from '../../../../types/user.types';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { RoleApiPath } from '../../../../api/apiPaths';
import { UserRolesSelector } from '../UserRolesSelector';
import { authenticatedApiRequest } from '../../../../api/apiRequest';
import { setNotification } from '../../../../redux/notificationSlice';
import { createUser } from '../../../../api/roleApi';
import { PositionField } from '../../fields/PositionField';
import { StartDateField } from '../../fields/StartDateField';
import { DatePicker } from '@mui/x-date-pickers';
import { getNewDateValue } from '../../../../utils/registration-helpers';

interface FormData {
  employments: Employment[];
  roles: RoleName[];
}

interface PersonTableRowProps {
  cristinPerson: CristinPerson;
  topOrgCristinIdentifier: string;
  customerId: string;
}

export const PersonTableRow = ({ cristinPerson, topOrgCristinIdentifier, customerId }: PersonTableRowProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const toggleDialog = () => setOpenDialog(!openDialog);
  const [selectedEmploymentIndex, setSelectedEmploymentIndex] = useState(0);

  const { cristinIdentifier, firstName, lastName, employments, orcid, nationalId } =
    convertToFlatCristinPerson(cristinPerson);
  const orcidUrl = orcid ? `${ORCID_BASE_URL}/${orcid}` : '';

  const username = `${cristinIdentifier}@${topOrgCristinIdentifier}`;
  const [user, isLoadingUser] = useFetch<InstitutionUser>({
    url: openDialog ? `${RoleApiPath.Users}/${username}` : '',
    withAuthentication: true,
    errorMessage: false,
  });

  const initialValues: FormData = {
    roles: user ? user.roles.map((role) => role.rolename) : [RoleName.Creator],
    employments: cristinPerson.employments,
  };

  const onSubmit = async (values: FormData) => {
    let updateUserResponse;
    if (user) {
      const newUser: InstitutionUser = {
        ...user,
        roles: values.roles.map((role) => ({ type: 'Role', rolename: role })),
      };

      updateUserResponse = await authenticatedApiRequest<null>({
        url: `${RoleApiPath.Users}/${username}`,
        method: 'PUT',
        data: newUser,
      });
    } else {
      updateUserResponse = await createUser({
        nationalIdentityNumber: nationalId,
        customerId,
        roles: values.roles.map((role) => ({ type: 'Role', rolename: role })),
      });
    }
    if (isSuccessStatus(updateUserResponse.status)) {
      toggleDialog();
      dispatch(setNotification({ message: t('feedback.success.update_institution_user'), variant: 'success' }));
    } else if (isErrorStatus(updateUserResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.update_institution_user'), variant: 'error' }));
    }
  };

  const activeEmployments = employments.filter(isActiveEmployment);
  const indicesWithThisInstitution: number[] = [];
  const activeEmploymentsInOtherInstitutions: Employment[] = [];
  const targetOrganizationIdStart = `${topOrgCristinIdentifier?.split('.')[0]}.`;

  employments.forEach((employment, i) => {
    const organizationIdentifier = employment.organization.split('/').pop();
    if (organizationIdentifier?.startsWith(targetOrganizationIdStart)) {
      indicesWithThisInstitution.push(i);
    } else if (isActiveEmployment(employment)) {
      activeEmploymentsInOtherInstitutions.push(employment);
    }
  });

  const employmentBaseFieldName = `employments[${indicesWithThisInstitution[selectedEmploymentIndex]}]`;

  return (
    <TableRow>
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
          <IconButton onClick={toggleDialog}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </TableCell>

      <Dialog open={openDialog} onClose={toggleDialog} maxWidth="md" fullWidth transitionDuration={{ exit: 0 }}>
        <DialogTitle>{t('basic_data.person_register.edit_person')}</DialogTitle>
        <Formik initialValues={initialValues} enableReinitialize onSubmit={onSubmit}>
          {({ values, isSubmitting, setFieldValue }: FormikProps<FormData>) => (
            <Form>
              <DialogContent>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <TextField variant="filled" disabled value={firstName} label={t('common.first_name')} />
                    <TextField variant="filled" disabled value={lastName} label={t('common.last_name')} />
                    <TextField
                      variant="filled"
                      disabled
                      value={getMaskedNationalIdentityNumber(nationalId)}
                      label={t('basic_data.person_register.national_identity_number')}
                    />
                    {orcid && <TextField variant="filled" disabled value={orcid} label={t('common.orcid')} />}
                    {activeEmploymentsInOtherInstitutions.length > 0 && (
                      <Box>
                        <Typography variant="overline">{t('basic_data.person_register.other_employments')}</Typography>
                        <Box component="ul" sx={{ my: 0, pl: '1rem' }}>
                          {activeEmploymentsInOtherInstitutions.map((affiliation) => (
                            <li key={affiliation.organization}>
                              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                                <AffiliationHierarchy unitUri={affiliation.organization} commaSeparated />
                              </Box>
                            </li>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                  <Divider flexItem orientation="vertical" />
                  <div>
                    <Typography variant="overline" display="block" gutterBottom>
                      {t('common.employments')}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <Field name={`${employmentBaseFieldName}.organization`}>
                        {({ field }: FieldProps<string>) => (
                          <AffiliationHierarchy unitUri={field.value} commaSeparated />
                        )}
                      </Field>

                      <Box display={{ display: 'flex', gap: '1rem' }}>
                        <PositionField fieldName={`${employmentBaseFieldName}.type`} disabled={isSubmitting || true} />

                        <Field name={`${employmentBaseFieldName}.fullTimeEquivalentPercentage`}>
                          {({ field, meta: { error, touched } }: FieldProps<string>) => (
                            <TextField
                              {...field}
                              required
                              disabled={isSubmitting || true}
                              fullWidth
                              type="number"
                              inputProps={{ min: '0', max: '100' }}
                              variant="filled"
                              label={t('basic_data.add_employee.position_percent')}
                              error={touched && !!error}
                              helperText={<ErrorMessage name={field.name} />}
                            />
                          )}
                        </Field>
                      </Box>
                      <Box display={{ display: 'flex', gap: '1rem' }}>
                        <StartDateField
                          fieldName={`${employmentBaseFieldName}.startDate`}
                          disabled={isSubmitting || true}
                          maxDate={values.employments[0].endDate ? new Date(values.employments[0].endDate) : undefined}
                        />

                        <Field name={`${employmentBaseFieldName}.endDate`}>
                          {({ field, meta: { error, touched } }: FieldProps<string>) => (
                            <DatePicker
                              disabled={isSubmitting || true}
                              label={t('common.end_date')}
                              PopperProps={{
                                'aria-label': t('common.end_date'),
                              }}
                              value={field.value ? field.value : null}
                              onChange={(date: Date | null, keyboardInput) => {
                                const newValue = getNewDateValue(date, keyboardInput);
                                if (newValue !== null) {
                                  setFieldValue(field.name, newValue);
                                }
                              }}
                              inputFormat="dd.MM.yyyy"
                              views={['year', 'month', 'day']}
                              mask="__.__.____"
                              minDate={
                                values.employments[0].startDate ? new Date(values.employments[0].startDate) : undefined
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...field}
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
                      {indicesWithThisInstitution.length > 1 && (
                        <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', alignSelf: 'center' }}>
                          <IconButton
                            title={t('common.previous')}
                            disabled={selectedEmploymentIndex === 0}
                            onClick={() => setSelectedEmploymentIndex(selectedEmploymentIndex - 1)}>
                            <NavigateBeforeIcon />
                          </IconButton>
                          <Typography>
                            {t('basic_data.person_register.employment_x_of_y', {
                              selected: selectedEmploymentIndex + 1,
                              total: indicesWithThisInstitution.length,
                            })}
                          </Typography>
                          <IconButton
                            title={t('common.next')}
                            disabled={selectedEmploymentIndex === indicesWithThisInstitution.length - 1}
                            onClick={() => setSelectedEmploymentIndex(selectedEmploymentIndex + 1)}>
                            <NavigateNextIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ mt: '2rem' }}>
                      <UserRolesSelector
                        selectedRoles={values.roles}
                        updateRoles={(newRoles) => setFieldValue('roles', newRoles)}
                        isLoading={isLoadingUser}
                        disabled={isSubmitting}
                      />
                    </Box>
                  </div>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={toggleDialog}>{t('common.cancel')}</Button>
                <LoadingButton loading={isSubmitting} variant="contained" type="submit">
                  {t('common.save')}
                </LoadingButton>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </TableRow>
  );
};

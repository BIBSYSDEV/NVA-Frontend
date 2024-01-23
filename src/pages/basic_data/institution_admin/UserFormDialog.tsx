import CancelIcon from '@mui/icons-material/Cancel';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { DatePicker, LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchPositions } from '../../../api/cristinApi';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { NationalIdNumberField } from '../../../components/NationalIdNumberField';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';
import { RootState } from '../../../redux/store';
import { CristinPerson, Employment, InstitutionUser, RoleName } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { convertToFlatCristinPerson, isActiveEmployment } from '../../../utils/user-helpers';
import { personDataValidationSchema } from '../../../utils/validation/basic_data/addEmployeeValidation';
import { PositionField } from '../fields/PositionField';
import { StartDateField } from '../fields/StartDateField';
import { UserRolesSelector } from './UserRolesSelector';
import { ViewingScopeSection } from './ViewingScopeSection';

interface UserFormDialogProps extends Pick<DialogProps, 'open'> {
  person: CristinPerson;
  onClose: () => void;
}

interface UserFormData {
  person?: CristinPerson;
  user?: InstitutionUser;
}

export const UserFormDialog = ({ open, onClose, person }: UserFormDialogProps) => {
  const { t } = useTranslation();

  const initialValues: UserFormData = {
    person,
    user: undefined,
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth transitionDuration={{ exit: 0 }}>
      <DialogTitle>{t('basic_data.person_register.edit_person')}</DialogTitle>
      <Formik
        initialValues={initialValues}
        enableReinitialize // Needed to update roles values when the institutionUser is recieved
        onSubmit={(values) => console.log('values', values)}
        validationSchema={personDataValidationSchema}>
        {({ values, isSubmitting, setFieldValue }: FormikProps<UserFormData>) => (
          <Form noValidate>
            <DialogContent>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr auto 1fr', gap: '1rem' }}>
                <PersonSection />
                <Divider flexItem orientation="vertical" />
                <AffiliationSection />
                <Divider flexItem orientation="vertical" />
                <section>
                  <UserRolesSelector
                    selectedRoles={[]}
                    updateRoles={function (roles: RoleName[]): void {
                      throw new Error('Function not implemented.');
                    }}
                    personHasNin={false}
                  />
                </section>
                <Divider flexItem orientation="vertical" />
                <ViewingScopeSection />
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button onClick={onClose}>{t('common.cancel')}</Button>
              <LoadingButton loading={isSubmitting} variant="contained" type="submit">
                {t('common.save')}
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

const PersonSection = () => {
  const { t } = useTranslation();
  const topOrgCristinId = useSelector((store: RootState) => store.user?.topOrgCristinId);

  const { values } = useFormikContext<UserFormData>();
  if (!values.person) {
    return null;
  }

  const { firstName, lastName, employments, orcid, nationalId } = convertToFlatCristinPerson(values.person);

  const topOrgCristinIdentifier = topOrgCristinId ? getIdentifierFromId(topOrgCristinId) : '';

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

  return (
    <section>
      <Typography variant="h3" gutterBottom>
        Person
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextField
          variant="filled"
          disabled
          value={firstName}
          label={t('common.first_name')}
          data-testid={dataTestId.basicData.personAdmin.firstName}
        />
        <TextField
          variant="filled"
          disabled
          value={lastName}
          label={t('common.last_name')}
          data-testid={dataTestId.basicData.personAdmin.lastName}
        />
        <NationalIdNumberField nationalId={nationalId} />
        {orcid && <TextField variant="filled" disabled value={orcid} label={t('common.orcid')} />}
        {employmentsInOtherInstitutions.some(isActiveEmployment) && (
          <div>
            <Typography variant="h3">{t('basic_data.person_register.other_employments')}</Typography>
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
    </section>
  );
};

const AffiliationSection = () => {
  const { t } = useTranslation();

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const toggleConfirmDeleteDialog = () => setOpenConfirmDeleteDialog(!openConfirmDeleteDialog);

  const { values, errors, touched, setFieldValue, isSubmitting } = useFormikContext<UserFormData>();
  const employments = values.person?.employments ?? [];

  const [employmentIndex, setEmploymentIndex] = useState(0);

  const positionsQuery = useQuery({
    queryKey: ['positions', true],
    queryFn: () => fetchPositions(true),
    meta: { errorMessage: t('feedback.error.get_positions') },
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
  });

  const employmentBaseFieldName = `person.employments[${employmentIndex}]`;

  return (
    <section>
      <Typography variant="h3" gutterBottom>
        {t('common.employments')}
      </Typography>
      {positionsQuery.isLoading ? (
        <CircularProgress />
      ) : employments.length === 0 ? (
        <Typography>Ingen ansettelser.</Typography>
      ) : (
        <div>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Field
              name={`${employmentBaseFieldName}.organization`}
              data-testid={dataTestId.basicData.personAdmin.employments()}>
              {({ field }: FieldProps<string>) => <AffiliationHierarchy unitUri={field.value} commaSeparated />}
            </Field>

            <Box display={{ display: 'flex', gap: '1rem' }}>
              <PositionField
                fieldName={`${employmentBaseFieldName}.type`}
                disabled={isSubmitting}
                includeDisabledPositions
              />

              <Field name={`${employmentBaseFieldName}.fullTimeEquivalentPercentage`}>
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    value={field.value ?? ''}
                    disabled={isSubmitting}
                    fullWidth
                    type="number"
                    inputProps={{ min: '0', max: '100' }}
                    variant="filled"
                    label={t('basic_data.add_employee.position_percent')}
                    error={touched && !!error}
                    helperText={touched && error}
                    data-testid={dataTestId.basicData.personAdmin.positionPercent}
                  />
                )}
              </Field>
            </Box>
            <Box display={{ display: 'flex', gap: '1rem' }}>
              <StartDateField
                fieldName={`${employmentBaseFieldName}.startDate`}
                disabled={isSubmitting}
                maxDate={
                  employments[employmentIndex].endDate ? new Date(employments[employmentIndex].endDate) : undefined
                }
                dataTestId={dataTestId.basicData.personAdmin.startDate}
              />

              <Field name={`${employmentBaseFieldName}.endDate`} data-testid={dataTestId.basicData.personAdmin.endDate}>
                {({ field, meta: { error, touched } }: FieldProps<string>) => (
                  <DatePicker
                    disabled={isSubmitting}
                    label={t('common.end_date')}
                    value={field.value ? new Date(field.value) : null}
                    onChange={(date: any) => setFieldValue(field.name, date ?? '')}
                    format="dd.MM.yyyy"
                    views={['year', 'month', 'day']}
                    minDate={
                      employments[employmentIndex].startDate
                        ? new Date(employments[employmentIndex].startDate)
                        : undefined
                    }
                    slotProps={{
                      textField: {
                        inputProps: { 'data-testid': dataTestId.basicData.personAdmin.endDate },
                        variant: 'filled',
                        error: touched && !!error,
                        helperText: <ErrorMessage name={field.name} />,
                      },
                    }}
                  />
                )}
              </Field>
            </Box>
            <Button
              disabled={isSubmitting}
              color="error"
              variant="outlined"
              onClick={toggleConfirmDeleteDialog}
              endIcon={<CancelIcon />}
              data-testid={dataTestId.basicData.personAdmin.removeEmployment}>
              {t('basic_data.person_register.remove_employment')}
            </Button>
            {employments.length > 1 && (
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
                    total: employments.length,
                  })}
                </Typography>
                <IconButton
                  title={t('common.next')}
                  disabled={employmentIndex === employments.length - 1}
                  onClick={() => setEmploymentIndex(employmentIndex + 1)}>
                  <NavigateNextIcon />
                </IconButton>
              </Box>
            )}
          </Box>
          {!!(errors.person as any)?.employments && !!(touched.person as any)?.employments && (
            <Typography color="error">{t('feedback.validation.employments_missing_data')}</Typography>
          )}
        </div>
      )}

      <ConfirmDialog
        open={openConfirmDeleteDialog}
        title={t('basic_data.person_register.remove_employment_title')}
        onAccept={() => {
          const filteredEmployments = employments.filter((_, index) => index !== employmentIndex);
          setFieldValue('person.employments', filteredEmployments);
          setEmploymentIndex(employmentIndex !== 0 ? employmentIndex - 1 : 0);
          toggleConfirmDeleteDialog();
        }}
        onCancel={toggleConfirmDeleteDialog}>
        <Typography>{t('basic_data.person_register.remove_employment_text')}</Typography>
      </ConfirmDialog>
    </section>
  );
};

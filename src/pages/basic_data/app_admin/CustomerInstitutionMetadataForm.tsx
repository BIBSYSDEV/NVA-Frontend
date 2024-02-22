import { LoadingButton } from '@mui/lab';
import { Box, Checkbox, Chip, Divider, FormControlLabel, FormLabel, TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  createCustomerInstitution,
  updateCustomerInstitution,
  updateDoiAgent,
} from '../../../api/customerInstitutionsApi';
import { InputContainerBox, StyledRightAlignedWrapper } from '../../../components/styled/Wrappers';
import { setNotification } from '../../../redux/notificationSlice';
import {
  CustomerInstitution,
  CustomerInstitutionFieldNames,
  CustomerInstitutionFormData,
  DoiAgent,
  emptyCustomerInstitution,
  emptyProtectedDoiAgent,
  Sector,
} from '../../../types/customerInstitution.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';
import { getAdminInstitutionPath } from '../../../utils/urlPaths';
import { customerInstitutionValidationSchema } from '../../../utils/validation/customerInstitutionValidation';
import { CustomerDoiPasswordField } from './CustomerDoiPasswordField';
import { CustomerInstitutionInformationFromCristin } from './CustomerInstitutionInformationFromCristin';
import { CustomerInstitutionTextField } from './CustomerInstitutionTextField';
import { OrganizationSearchField } from './OrganizationSearchField';

interface CustomerInstitutionMetadataFormProps {
  customerInstitution?: CustomerInstitution;
  doiAgent?: DoiAgent;
  editMode: boolean;
}

export const CustomerInstitutionMetadataForm = ({
  customerInstitution,
  doiAgent,
  editMode,
}: CustomerInstitutionMetadataFormProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSubmit = async ({ customer, doiAgent, canAssignDoi }: CustomerInstitutionFormData) => {
    if (!editMode) {
      const createCustomerResponse = await createCustomerInstitution(customer);
      if (isErrorStatus(createCustomerResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.create_customer'), variant: 'error' }));
      } else if (isSuccessStatus(createCustomerResponse.status)) {
        history.push(getAdminInstitutionPath(createCustomerResponse.data.id));
        dispatch(
          setNotification({
            message: t('feedback.success.created_customer'),
            variant: 'success',
          })
        );
      }
    } else {
      const updateCustomerResponse = await updateCustomerInstitution(customer);
      if (isErrorStatus(updateCustomerResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.update_customer'), variant: 'error' }));
      } else if (isSuccessStatus(updateCustomerResponse.status)) {
        if (customerInstitution?.doiAgent.id) {
          if (!canAssignDoi && doiAgent.username) {
            // Set empty username of doiAgent if user has un-checked support DOI
            doiAgent.username = '';
          }
          const updateDoiAgentResponse = await updateDoiAgent(doiAgent);
          if (isErrorStatus(updateDoiAgentResponse.status)) {
            dispatch(
              setNotification({
                message: t('feedback.error.update_doi_agent'),
                variant: 'error',
              })
            );
          } else if (isSuccessStatus(updateDoiAgentResponse.status)) {
            dispatch(
              setNotification({
                message: t('feedback.success.update_customer'),
                variant: 'success',
              })
            );
          }
        } else {
          dispatch(
            setNotification({
              message: t('feedback.error.update_doi_agent'),
              variant: 'error',
            })
          );
        }
      }
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        canAssignDoi: !!doiAgent?.username,
        customer: {
          ...emptyCustomerInstitution,
          ...customerInstitution,
        },
        doiAgent: {
          ...emptyProtectedDoiAgent,
          ...doiAgent,
        },
      }}
      validateOnChange
      validationSchema={customerInstitutionValidationSchema}
      onSubmit={handleSubmit}>
      {({ values, isSubmitting, setValues, setFieldValue }: FormikProps<CustomerInstitutionFormData>) => (
        <Form noValidate>
          <InputContainerBox>
            {!editMode && (
              <Field name={CustomerInstitutionFieldNames.Name}>
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <OrganizationSearchField
                    onChange={(selectedInstitution) => {
                      const name = selectedInstitution?.labels ? getLanguageString(selectedInstitution.labels) : '';
                      setValues({
                        canAssignDoi: false,
                        customer: {
                          ...emptyCustomerInstitution,
                          name,
                          displayName: name,
                          cristinId: selectedInstitution?.id ?? '',
                        },
                        doiAgent: emptyProtectedDoiAgent,
                      });
                    }}
                    errorMessage={touched && !!error ? error : undefined}
                    fieldInputProps={field}
                  />
                )}
              </Field>
            )}

            <CustomerInstitutionInformationFromCristin cristinId={values.customer.cristinId} />
            <CustomerInstitutionTextField
              name={CustomerInstitutionFieldNames.FeideOrganizationDomain}
              label={t('basic_data.institutions.feide_organization_domain')}
              dataTestId={dataTestId.basicData.institutionAdmin.feideField}
            />
            <CustomerInstitutionTextField
              name={CustomerInstitutionFieldNames.RorId}
              label={t('basic_data.institutions.ror')}
              dataTestId={dataTestId.basicData.institutionAdmin.rorField}
            />

            <Field name={CustomerInstitutionFieldNames.Sector}>
              {({ field }: FieldProps) => (
                <div>
                  <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>
                    {t('basic_data.institutions.sector')}
                  </FormLabel>
                  <Box sx={{ display: 'flex', gap: '0.5rem', mt: '0.5rem' }}>
                    {Object.values(Sector).map((sector) => (
                      <Chip
                        key={sector}
                        data-testid={dataTestId.basicData.institutionAdmin.sectorChip(sector)}
                        label={t(`basic_data.institutions.sector_values.${sector}`)}
                        color="primary"
                        variant={field.value === sector ? 'filled' : 'outlined'}
                        onClick={() => setFieldValue(field.name, sector)}
                      />
                    ))}
                  </Box>
                </div>
              )}
            </Field>

            <div>
              <Field name={CustomerInstitutionFieldNames.NviInstitution}>
                {({ field }: FieldProps<boolean>) => (
                  <>
                    <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>
                      {t('common.nvi')}
                    </FormLabel>
                    <FormControlLabel
                      label={t('basic_data.institutions.institution_is_nvi_applicable')}
                      control={
                        <Checkbox
                          data-testid={dataTestId.basicData.institutionAdmin.nviInstitutionCheckbox}
                          {...field}
                          checked={field.value}
                          onChange={(event, checked) => {
                            if (!checked) {
                              setFieldValue(CustomerInstitutionFieldNames.RboInstitution, false);
                            }
                            field.onChange(event);
                          }}
                        />
                      }
                    />
                  </>
                )}
              </Field>

              <Field name={CustomerInstitutionFieldNames.RboInstitution}>
                {({ field }: FieldProps<boolean>) => (
                  <Box sx={{ ml: '2rem' }}>
                    <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>
                      {t('common.rbo')}
                    </FormLabel>
                    <FormControlLabel
                      label={t('basic_data.institutions.institution_receives_funding_via_rbo')}
                      disabled={!values.customer.nviInstitution}
                      control={
                        <Checkbox
                          data-testid={dataTestId.basicData.institutionAdmin.rboInstitutionCheckbox}
                          {...field}
                          checked={field.value}
                        />
                      }
                    />
                  </Box>
                )}
              </Field>
            </div>

            <Divider />

            <Field name={CustomerInstitutionFieldNames.InactiveFrom}>
              {({ field }: FieldProps<string | undefined>) => (
                <FormControlLabel
                  label={t('basic_data.institutions.institution_is_inactive')}
                  control={
                    <Checkbox
                      onChange={(_event, checked) => {
                        setFieldValue(
                          CustomerInstitutionFieldNames.InactiveFrom,
                          checked ? new Date().toISOString() : null
                        );
                      }}
                      data-testid={dataTestId.basicData.institutionAdmin.inactiveCheckbox}
                      checked={!!field.value}
                    />
                  }
                />
              )}
            </Field>

            <Divider />

            {editMode && (
              <div>
                <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>
                  {t('common.doi_long')}
                </FormLabel>
                <Field name={CustomerInstitutionFieldNames.CanAssignDoi}>
                  {({ field }: FieldProps<boolean>) => (
                    <FormControlLabel
                      label={t('basic_data.institutions.can_assign_doi')}
                      control={
                        <Checkbox
                          data-testid={dataTestId.basicData.institutionAdmin.canAssignDoiCheckbox}
                          {...field}
                          checked={field.value}
                        />
                      }
                    />
                  )}
                </Field>
                {values.canAssignDoi && (
                  <Box sx={{ display: 'flex', gap: '1rem' }}>
                    <Field name={CustomerInstitutionFieldNames.DoiUsername}>
                      {({ field, form: { setFieldValue }, meta: { touched, error } }: FieldProps<string>) => (
                        <TextField
                          {...field}
                          data-testid={dataTestId.basicData.institutionAdmin.doiUsernameField}
                          label={t('basic_data.institutions.doi_repo_id')}
                          required
                          fullWidth
                          onChange={(event) => {
                            const inputValue = event.target.value;
                            const formattedValue = inputValue.toUpperCase().replace(/[^A-Z.]/g, '');
                            setFieldValue(CustomerInstitutionFieldNames.DoiUsername, formattedValue);
                          }}
                          variant="filled"
                          error={touched && !!error}
                          helperText={<ErrorMessage name={field.name} />}
                        />
                      )}
                    </Field>
                    <CustomerInstitutionTextField
                      required
                      name={CustomerInstitutionFieldNames.DoiPrefix}
                      label={t('basic_data.institutions.doi_prefix')}
                      dataTestId={dataTestId.basicData.institutionAdmin.doiPrefixField}
                    />

                    <CustomerDoiPasswordField doiAgentId={customerInstitution?.doiAgent.id ?? ''} />
                  </Box>
                )}
              </div>
            )}
            <StyledRightAlignedWrapper>
              <LoadingButton
                data-testid={dataTestId.basicData.institutionAdmin.saveButton}
                variant="contained"
                loading={isSubmitting}
                type="submit">
                {editMode ? t('common.save') : t('common.create')}
              </LoadingButton>
            </StyledRightAlignedWrapper>
          </InputContainerBox>
        </Form>
      )}
    </Formik>
  );
};

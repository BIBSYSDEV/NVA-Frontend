import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useHistory } from 'react-router-dom';
import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  CustomerInstitution,
  emptyCustomerInstitution,
  CustomerInstitutionFieldNames,
  CustomerInstitutionFormData,
  DoiAgent,
  emptyProtectedDoiAgent,
} from '../../../types/customerInstitution.types';
import { setNotification } from '../../../redux/notificationSlice';
import {
  createCustomerInstitution,
  updateCustomerInstitution,
  updateDoiAgent,
} from '../../../api/customerInstitutionsApi';
import { InputContainerBox, StyledRightAlignedWrapper } from '../../../components/styled/Wrappers';
import { customerInstitutionValidationSchema } from '../../../utils/validation/customerInstitutionValidation';
import { getAdminInstitutionPath } from '../../../utils/urlPaths';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';
import { OrganizationSearchField } from './OrganizationSearchField';
import { CustomerInstitutionTextField } from './CustomerInstitutionTextField';
import { CustomerDoiPasswordField } from './CustomerDoiPasswordField';

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
        dispatch(setNotification({ message: t('feedback.success.created_customer'), variant: 'success' }));
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
            dispatch(setNotification({ message: t('feedback.error.update_doi_agent'), variant: 'error' }));
          } else if (isSuccessStatus(updateDoiAgentResponse.status)) {
            dispatch(setNotification({ message: t('feedback.success.update_customer'), variant: 'success' }));
          }
        } else {
          dispatch(setNotification({ message: t('feedback.error.update_doi_agent'), variant: 'error' }));
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
      {({ values, isSubmitting, setValues }: FormikProps<CustomerInstitutionFormData>) => (
        <Form noValidate>
          <InputContainerBox>
            <Field name={CustomerInstitutionFieldNames.Name}>
              {({ field, meta: { touched, error } }: FieldProps<string>) =>
                !editMode ? (
                  <OrganizationSearchField
                    onChange={(selectedInstitution) => {
                      const name = selectedInstitution?.name ? getLanguageString(selectedInstitution.name) : '';
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
                ) : (
                  <TextField
                    variant="filled"
                    label={t('common.institution')}
                    data-testid={dataTestId.organization.searchField}
                    required
                    disabled
                    {...field}
                  />
                )
              }
            </Field>
            <CustomerInstitutionTextField
              name={CustomerInstitutionFieldNames.DisplayName}
              label={t('basic_data.institutions.display_name')}
              required
              dataTestId={dataTestId.basicData.institutionAdmin.displayNameField}
            />
            <CustomerInstitutionTextField
              name={CustomerInstitutionFieldNames.ShortName}
              label={t('basic_data.institutions.short_name')}
              required
              dataTestId={dataTestId.basicData.institutionAdmin.shortNameField}
            />
            <CustomerInstitutionTextField
              name={CustomerInstitutionFieldNames.ArchiveName}
              label={t('basic_data.institutions.archive_name')}
              dataTestId={dataTestId.basicData.institutionAdmin.archiveNameField}
            />
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

            {editMode && (
              <div>
                <Field name={CustomerInstitutionFieldNames.CanAssignDoi}>
                  {({ field }: FieldProps<boolean>) => (
                    <FormControlLabel
                      label={t('basic_data.institutions.can_assign_doi')}
                      control={
                        <Checkbox
                          data-testid={dataTestId.basicData.institutionAdmin.canAssignDoiCheckbox}
                          required
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
                    <CustomerInstitutionTextField
                      required
                      name={CustomerInstitutionFieldNames.DoiUrl}
                      label={t('basic_data.institutions.doi_url')}
                      dataTestId={dataTestId.basicData.institutionAdmin.doiUrlField}
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

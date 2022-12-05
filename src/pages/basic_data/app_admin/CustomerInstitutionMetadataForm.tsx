import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useHistory } from 'react-router-dom';
import { TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  CustomerInstitution,
  emptyCustomerInstitution,
  CustomerInstitutionFieldNames,
} from '../../../types/customerInstitution.types';
import { setNotification } from '../../../redux/notificationSlice';
import { createCustomerInstitution, updateCustomerInstitution } from '../../../api/customerInstitutionsApi';
import { InputContainerBox, StyledRightAlignedWrapper } from '../../../components/styled/Wrappers';
import { customerInstitutionValidationSchema } from '../../../utils/validation/customerInstitutionValidation';
import { getAdminInstitutionPath } from '../../../utils/urlPaths';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';
import { OrganizationSearchField } from './OrganizationSearchField';
import { CustomerInstitutionTextField } from './CustomerInstitutionTextField';

interface CustomerInstitutionMetadataFormProps {
  customerInstitution: CustomerInstitution;
  editMode: boolean;
}

export const CustomerInstitutionMetadataForm = ({
  customerInstitution,
  editMode,
}: CustomerInstitutionMetadataFormProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSubmit = async (values: CustomerInstitution) => {
    if (!editMode) {
      const createCustomerResponse = await createCustomerInstitution(values);
      if (isErrorStatus(createCustomerResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.create_customer'), variant: 'error' }));
      } else if (isSuccessStatus(createCustomerResponse.status)) {
        history.push(getAdminInstitutionPath(createCustomerResponse.data.id));
        dispatch(setNotification({ message: t('feedback.success.created_customer'), variant: 'success' }));
      }
    } else {
      const updateCustomerResponse = await updateCustomerInstitution(values);
      if (isErrorStatus(updateCustomerResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.update_customer'), variant: 'error' }));
      } else if (isSuccessStatus(updateCustomerResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.update_customer'), variant: 'success' }));
      }
    }
  };

  return (
    <>
      <Typography variant="h2" paragraph>
        {t('common.institution')}
      </Typography>
      <Formik
        enableReinitialize
        initialValues={{ ...emptyCustomerInstitution, ...customerInstitution }}
        validateOnChange
        validationSchema={customerInstitutionValidationSchema}
        onSubmit={handleSubmit}>
        {({ isSubmitting, setValues }: FormikProps<CustomerInstitution>) => (
          <Form noValidate>
            <InputContainerBox>
              <Field name={CustomerInstitutionFieldNames.Name}>
                {({ field, meta: { touched, error } }: FieldProps<string>) =>
                  !editMode ? (
                    <OrganizationSearchField
                      onChange={(selectedInstitution) => {
                        const name = selectedInstitution?.name ? getLanguageString(selectedInstitution.name) : '';
                        setValues({
                          ...emptyCustomerInstitution,
                          [CustomerInstitutionFieldNames.Name]: name,
                          [CustomerInstitutionFieldNames.DisplayName]: name,
                          [CustomerInstitutionFieldNames.CristinId]: selectedInstitution?.id ?? '',
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
                dataTestId={dataTestId.institutionAdmin.displayNameField}
              />
              <CustomerInstitutionTextField
                name={CustomerInstitutionFieldNames.ShortName}
                label={t('basic_data.institutions.short_name')}
                required
                dataTestId={dataTestId.institutionAdmin.shortNameField}
              />
              <CustomerInstitutionTextField
                name={CustomerInstitutionFieldNames.ArchiveName}
                label={t('basic_data.institutions.archive_name')}
                dataTestId={dataTestId.institutionAdmin.archiveNameField}
              />
              <CustomerInstitutionTextField
                name={CustomerInstitutionFieldNames.FeideOrganizationDomain}
                label={t('basic_data.institutions.feide_organization_domain')}
                dataTestId={dataTestId.institutionAdmin.feideField}
              />
              <CustomerInstitutionTextField
                name={CustomerInstitutionFieldNames.RorId}
                label={t('basic_data.institutions.ror')}
                dataTestId={dataTestId.institutionAdmin.rorField}
              />
              <StyledRightAlignedWrapper>
                <LoadingButton
                  data-testid={dataTestId.institutionAdmin.saveButton}
                  variant="contained"
                  loadingPosition="start"
                  loading={isSubmitting}
                  type="submit">
                  {editMode ? t('common.save') : t('common.create')}
                </LoadingButton>
              </StyledRightAlignedWrapper>
            </InputContainerBox>
          </Form>
        )}
      </Formik>
    </>
  );
};

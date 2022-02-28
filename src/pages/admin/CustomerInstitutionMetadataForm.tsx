import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useHistory } from 'react-router-dom';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, TextField, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import {
  CustomerInstitution,
  emptyCustomerInstitution,
  CustomerInstitutionFieldNames,
} from '../../types/customerInstitution.types';
import { setNotification } from '../../redux/actions/notificationActions';
import { createCustomerInstitution, updateCustomerInstitution } from '../../api/customerInstitutionsApi';
import { InputContainerBox, StyledRightAlignedWrapper } from '../../components/styled/Wrappers';
import { customerInstitutionValidationSchema } from '../../utils/validation/customerInstitutionValidation';
import { CustomerInstitutionTextField } from './customerInstitutionFields/CustomerInstitutionTextField';
import { OrganizationSearchField } from './customerInstitutionFields/OrganizationSearchField';
import { getAdminInstitutionPath } from '../../utils/urlPaths';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { getLanguageString } from '../../utils/translation-helpers';

interface CustomerInstitutionMetadataFormProps {
  customerInstitution: CustomerInstitution;
  editMode: boolean;
}

export const CustomerInstitutionMetadataForm = ({
  customerInstitution,
  editMode,
}: CustomerInstitutionMetadataFormProps) => {
  const { t } = useTranslation('admin');
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSubmit = async (values: CustomerInstitution) => {
    if (!editMode) {
      const createCustomerResponse = await createCustomerInstitution(values);
      if (isErrorStatus(createCustomerResponse.status)) {
        dispatch(setNotification(t('feedback:error.create_customer'), 'error'));
      } else if (isSuccessStatus(createCustomerResponse.status)) {
        history.push(getAdminInstitutionPath(createCustomerResponse.data.id));
        dispatch(setNotification(t('feedback:success.created_customer')));
      }
    } else {
      const updateCustomerResponse = await updateCustomerInstitution(values);
      if (isErrorStatus(updateCustomerResponse.status)) {
        dispatch(setNotification(t('feedback:error.update_customer'), 'error'));
      } else if (isSuccessStatus(updateCustomerResponse.status)) {
        dispatch(setNotification(t('feedback:success.update_customer')));
      }
    }
  };

  return (
    <>
      <Typography variant="h2" paragraph>
        {t('common:institution')}
      </Typography>
      <Formik
        enableReinitialize
        initialValues={{ ...emptyCustomerInstitution, ...customerInstitution }}
        validateOnChange
        validationSchema={customerInstitutionValidationSchema}
        onSubmit={handleSubmit}>
        {({ isSubmitting, setValues, setFieldValue, values }: FormikProps<CustomerInstitution>) => (
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
                    <TextField variant="filled" label={t('common:institution')} required disabled {...field} />
                  )
                }
              </Field>
              <CustomerInstitutionTextField
                name={CustomerInstitutionFieldNames.DisplayName}
                label={t('display_name')}
                required
                dataTestId={dataTestId.institutionAdmin.displayNameField}
              />
              <CustomerInstitutionTextField
                name={CustomerInstitutionFieldNames.ShortName}
                label={t('short_name')}
                required
                dataTestId={dataTestId.institutionAdmin.shortNameField}
              />
              <CustomerInstitutionTextField
                name={CustomerInstitutionFieldNames.ArchiveName}
                label={t('archive_name')}
                dataTestId={dataTestId.institutionAdmin.archiveNameField}
              />
              <CustomerInstitutionTextField
                name={CustomerInstitutionFieldNames.FeideOrganizationId}
                label={t('feide_organization_id')}
                required
                dataTestId={dataTestId.institutionAdmin.feideField}
              />

              <FormControl component="fieldset">
                <FormLabel>{t('login.login_method')}</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.loginMethods.feide}
                        onChange={() =>
                          setFieldValue(CustomerInstitutionFieldNames.LoginMethodFeide, !values.loginMethods.feide)
                        }
                      />
                    }
                    label={t<string>('login.feide')}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.loginMethods.minId}
                        onChange={() =>
                          setFieldValue(CustomerInstitutionFieldNames.LoginMethodMinId, !values.loginMethods.minId)
                        }
                      />
                    }
                    label={t<string>('login.min_id')}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.loginMethods.helseId}
                        onChange={() =>
                          setFieldValue(CustomerInstitutionFieldNames.LoginMethodHelseId, !values.loginMethods.helseId)
                        }
                      />
                    }
                    label={t<string>('login.helse_id')}
                  />
                </FormGroup>
              </FormControl>

              <StyledRightAlignedWrapper>
                <LoadingButton
                  data-testid={dataTestId.institutionAdmin.saveButton}
                  variant="contained"
                  startIcon={<SaveIcon />}
                  loadingPosition="start"
                  loading={isSubmitting}
                  type="submit">
                  {editMode ? t('common:save') : t('common:create')}
                </LoadingButton>
              </StyledRightAlignedWrapper>
            </InputContainerBox>
          </Form>
        )}
      </Formik>
    </>
  );
};

import React, { FC, useEffect, useState } from 'react';
import Card from '../../components/Card';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps, Form, Formik } from 'formik';
import { Button } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import Heading from '../../components/Heading';
import styled from 'styled-components';
import * as Yup from 'yup';
import {
  CustomerInstitutionFieldNames,
  emptyCustomerInstitution,
  CustomerInstitution,
} from '../../types/customerInstitution.types';
import { createUppy } from '../../utils/uppy-config';
// import Label from '../../components/Label';
// import InstitutionLogoFileUploader from './InstitutionLogoFileUploader';
// import FileCard from '../publication/files_and_license_tab/FileCard';
import InstitutionSearch from '../publication/references_tab/components/InstitutionSearch';
import { useParams, useHistory } from 'react-router-dom';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { useDispatch } from 'react-redux';
import {
  getInstitution,
  createCustomerInstitution,
  updateCustomerInstitution,
} from '../../api/customerInstitutionsApi';
import Progress from '../../components/Progress';

const shouldAllowMultipleFiles = false;

// const StyledLogoUploadWrapper = styled(Card)`
//   margin-top: 1rem;
// `;

const StyledButtonContainer = styled.div`
  margin-top: 2rem;
  margin-right: 1rem;
  display: flex;
  justify-content: flex-end;
`;

const StyledProgressContainer = styled.div`
  padding-left: 1rem;
  display: flex;
  align-items: center;
`;

const AdminCustomerInstitutionPage: FC = () => {
  const { t } = useTranslation('admin');
  const [uppy] = useState(createUppy(shouldAllowMultipleFiles));
  const { identifier } = useParams();
  const editMode = identifier !== 'new';
  const [initialValues, setInitialValues] = useState<CustomerInstitution>(emptyCustomerInstitution);
  const [isLoading, setIsLoading] = useState(editMode);
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    return () => uppy && uppy.close();
  }, [uppy]);

  useEffect(() => {
    const getInstitutionById = async (identifier: string) => {
      const institution: CustomerInstitution = await getInstitution(identifier);
      if (institution?.error) {
        dispatch(setNotification(institution.error, NotificationVariant.Error));
      } else {
        setInitialValues(institution);
        setIsLoading(false);
      }
    };

    if (identifier && editMode) {
      getInstitutionById(identifier);
    }
  }, [identifier, dispatch, editMode]);

  const handleSubmit = async (values: CustomerInstitution) => {
    setIsSaving(true);
    if (!editMode) {
      const customerValues = { ...values, createdDate: new Date().toISOString() }; // TODO: remove setting createdDate when fixed in backend
      const createdCustomer = await createCustomerInstitution(customerValues);
      if (!createdCustomer || createdCustomer?.error) {
        dispatch(setNotification(createdCustomer.error, NotificationVariant.Error));
      } else {
        history.push(`/admin-institutions/${createdCustomer.identifier}`);
        setInitialValues(createdCustomer);
        dispatch(setNotification(t('feedback:success.created_customer')));
      }
    } else {
      const updatedCustomer = await updateCustomerInstitution(values);
      if (updatedCustomer?.error) {
        dispatch(setNotification(updatedCustomer.error, NotificationVariant.Error));
      } else {
        setInitialValues(updatedCustomer);
        dispatch(setNotification(t('feedback:success.update_customer')));
      }
    }
    setIsSaving(false);
  };

  return isLoading ? (
    <Progress />
  ) : (
    <Card>
      <Heading>{t(editMode ? 'edit_institution' : 'add_institution')}</Heading>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={Yup.object({
          name: Yup.string().required(t('feedback.required_field')),
        })}
        onSubmit={handleSubmit}>
        <Form>
          {/* TODO uncomment when backend has support for logo */}
          {/* <Field name={CustomerInstitutionFieldNames.LOGO_FILE}>
            {({ field: { value, name }, form }: FieldProps) => (
              <StyledLogoUploadWrapper>
                <Label>{t('institution_logo')}</Label>
                <InstitutionLogoFileUploader
                  uppy={uppy}
                  shouldAllowMultipleFiles={shouldAllowMultipleFiles}
                  setFile={(file) => {
                    form.setFieldValue(name, file);
                  }}
                />
                {value?.name && (
                  <FileCard
                    file={value}
                    removeFile={() => {
                      uppy.removeFile(value.id);
                      form.setFieldValue(name, {});
                    }}
                  />
                )}
              </StyledLogoUploadWrapper>
            )}
          </Field> */}
          <Field name={CustomerInstitutionFieldNames.NAME}>
            {({ field: { value, name }, form }: FieldProps) => (
              <InstitutionSearch
                dataTestId="autosearch-institution"
                label={t('organization_register_name')}
                initialValue={value ?? ''}
                clearSearchField={value?.name === ''}
                setValueFunction={(inputValue) => {
                  form.setFieldValue(name, inputValue.name);
                }}
                placeholder={t('profile:organization.search_for_institution')}
              />
            )}
          </Field>
          <Field
            aria-label={CustomerInstitutionFieldNames.DISPLAY_NAME}
            name={CustomerInstitutionFieldNames.DISPLAY_NAME}
            label={t('display_name')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-institution-display-name-input' }}
          />
          <Field
            aria-label={CustomerInstitutionFieldNames.SHORT_NAME}
            name={CustomerInstitutionFieldNames.SHORT_NAME}
            label={t('short_name')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-institution-short-name-input' }}
          />
          <Field
            aria-label={CustomerInstitutionFieldNames.ARCHIVE_NAME}
            name={CustomerInstitutionFieldNames.ARCHIVE_NAME}
            label={t('archive_name')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-institution-archive-name-input' }}
          />
          <Field
            aria-label={CustomerInstitutionFieldNames.CNAME}
            name={CustomerInstitutionFieldNames.CNAME}
            label={t('cname')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-institution-cname-input' }}
          />
          <Field
            aria-label={CustomerInstitutionFieldNames.INSTITUTION_DNS}
            name={CustomerInstitutionFieldNames.INSTITUTION_DNS}
            label={t('institution_dns')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-institution-institution-dns-input' }}
          />
          <Field
            aria-label={CustomerInstitutionFieldNames.ADMINISTRATION_ID}
            name={CustomerInstitutionFieldNames.ADMINISTRATION_ID}
            label={t('administration_id')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-institution-administrator-id-input' }}
          />
          <Field
            aria-label={CustomerInstitutionFieldNames.FEIDE_ORGANIZATION_ID}
            name={CustomerInstitutionFieldNames.FEIDE_ORGANIZATION_ID}
            label={t('feide_organization_id')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-institution-feide-organization-id-input' }}
          />
          <StyledButtonContainer>
            <Button color="primary" data-testid="customer-institution-save-button" variant="contained" type="submit">
              {editMode ? t('common:save') : t('common:create')}
              {isSaving && (
                <StyledProgressContainer>
                  <Progress size={15} thickness={5} />
                </StyledProgressContainer>
              )}
            </Button>
          </StyledButtonContainer>
        </Form>
      </Formik>
    </Card>
  );
};

export default AdminCustomerInstitutionPage;

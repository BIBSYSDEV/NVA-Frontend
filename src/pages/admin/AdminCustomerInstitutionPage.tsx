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
import Label from '../../components/Label';
import InstitutionLogoFileUploader from './InstitutionLogoFileUploader';
import FileCard from '../publication/files_and_license_tab/FileCard';
import InstitutionSearch from '../publication/references_tab/components/InstitutionSearch';
import { useParams } from 'react-router-dom';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { useDispatch } from 'react-redux';
import { getInstitution } from '../../api/customerInstitutionsApi';

const shouldAllowMultipleFiles = false;

const StyledLogoUploadWrapper = styled(Card)`
  margin-top: 1rem;
`;

const StyledButtonContainer = styled.div`
  margin-top: 2rem;
  margin-right: 1rem;
  display: flex;
  justify-content: flex-end;
`;

const AdminCustomerInstitutionPage: FC = () => {
  const { t } = useTranslation('admin');
  const [uppy] = useState(createUppy(shouldAllowMultipleFiles));
  const [initialValues, setInitialValues] = useState<CustomerInstitution>(emptyCustomerInstitution);
  const { identifier } = useParams();
  const dispatch = useDispatch();
  const editMode = identifier !== 'new';

  useEffect(() => {
    return () => uppy && uppy.close();
  }, [uppy]);

  useEffect(() => {
    const getInstitutionById = async (id: string) => {
      const institution: any = await getInstitution(id);
      if (institution?.error) {
        dispatch(setNotification(institution.error, NotificationVariant.Error));
      } else {
        setInitialValues(institution);
      }
    };

    if (identifier && editMode) {
      getInstitutionById(identifier);
    }
  }, [identifier, dispatch, editMode]);

  return (
    <Card>
      <Heading>{t(editMode ? 'edit_institution' : 'add_institution')}</Heading>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={Yup.object({
          name: Yup.string().required(t('feedback.required_field')),
        })}
        onSubmit={(values) => {
          console.log('values', values);
        }}>
        <Form>
          <Field name={CustomerInstitutionFieldNames.LOGO_FILE}>
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
          </Field>
          <Field name={CustomerInstitutionFieldNames.NAME}>
            {({ field: { value, name }, form }: FieldProps) => (
              <InstitutionSearch
                dataTestId="autosearch-institution"
                label={t('organization_register_name')}
                clearSearchField={value.name === ''}
                setValueFunction={(inputValue) => {
                  form.setFieldValue(name, inputValue.name);
                  form.setFieldValue(CustomerInstitutionFieldNames.ID, inputValue.id);
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
            inputProps={{ 'data-testid': 'customer-instituiton-display-name-input' }}
          />
          <Field
            aria-label={CustomerInstitutionFieldNames.SHORT_NAME}
            name={CustomerInstitutionFieldNames.SHORT_NAME}
            label={t('short_name')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-instituiton-short-name-input' }}
          />
          <Field
            aria-label={CustomerInstitutionFieldNames.ARCHIVE_NAME}
            name={CustomerInstitutionFieldNames.ARCHIVE_NAME}
            label={t('archive_name')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-instituiton-archive-name-input' }}
          />
          <Field
            aria-label={CustomerInstitutionFieldNames.CNAME}
            name={CustomerInstitutionFieldNames.CNAME}
            label={t('cname')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-instituiton-cname-input' }}
          />
          <Field
            aria-label={CustomerInstitutionFieldNames.INSTITUTION_DNS}
            name={CustomerInstitutionFieldNames.INSTITUTION_DNS}
            label={t('institution_dns')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-instituiton-institution-dns-input' }}
          />
          <Field
            aria-label={CustomerInstitutionFieldNames.ADMINISTRATION_ID}
            name={CustomerInstitutionFieldNames.ADMINISTRATION_ID}
            label={t('administration_id')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-instituiton-administrator-id-input' }}
          />
          <Field
            aria-label={CustomerInstitutionFieldNames.FEIDE_ORGANIZATION_ID}
            name={CustomerInstitutionFieldNames.FEIDE_ORGANIZATION_ID}
            label={t('feide_organization_id')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-instituiton-feide-organization-id-input' }}
          />
          <StyledButtonContainer>
            <Button color="primary" data-testid="customer-instituiton-save-button" variant="contained" type="submit">
              {t('common:save')}
            </Button>
          </StyledButtonContainer>
        </Form>
      </Formik>
    </Card>
  );
};

export default AdminCustomerInstitutionPage;

import React, { FC, useEffect, useState } from 'react';
import Card from '../../components/Card';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  CustomerInstitutionFieldNames,
  emptyCustomerInstitution,
  emptyInstitutionLogoFile,
  InstitutionLogoFile,
} from '../../types/customerInstitution.types';
import { Button } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import Heading from '../../components/Heading';
import UppyDashboard from '../../components/UppyDashboard';
import { createUppy } from '../../utils/uppy-config';
import Label from '../../components/Label';

const StyledField = styled(Field)`
  margin: 1rem;
  flex: 1 0 40%;
`;

const StyledButtonContainer = styled.div`
  margin-top: 2rem;
  margin-right: 1rem;
  display: flex;
  justify-content: flex-end;
`;

const shouldAllowMultipleFiles = false;

const AdminCustomerInstitutionPage: FC = () => {
  const { t } = useTranslation('admin');
  const [uppy] = useState(createUppy(shouldAllowMultipleFiles));
  const [uploadedFile, setUploadedFile] = useState<InstitutionLogoFile>(emptyInstitutionLogoFile);
  const initialValues = emptyCustomerInstitution;

  useEffect(() => {
    if (uppy && !uppy.hasUploadSuccessEventListener) {
      const addFile = (newFile: InstitutionLogoFile) => {
        setUploadedFile(newFile);
      };

      uppy.on('upload-success', addFile);
      uppy.hasUploadSuccessEventListener = true;

      return () => {
        uppy.off('upload-success', addFile);
        uppy.hasUploadSuccessEventListener = false;
      };
    }
  }, [uppy, uploadedFile]);

  return (
    <Card>
      <Heading>{t('add_institution')}</Heading>
      {uppy && (
        <Card>
          <Label>{t('institution_logo')}</Label>
          <UppyDashboard uppy={uppy} shouldAllowMultipleFiles={shouldAllowMultipleFiles} />
          {uploadedFile && <div>{uploadedFile.name}</div>}
        </Card>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          name: Yup.string().required(t('feedback.required_field')),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}>
        <Form>
          <StyledField
            aria-label={CustomerInstitutionFieldNames.NAME}
            name={CustomerInstitutionFieldNames.NAME}
            label={t('organization_register_name')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-instituiton-name-input' }}
          />
          <StyledField
            aria-label={CustomerInstitutionFieldNames.DISPLAY_NAME}
            name={CustomerInstitutionFieldNames.DISPLAY_NAME}
            label={t('display_name')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-instituiton-display-name-input' }}
          />
          <StyledField
            aria-label={CustomerInstitutionFieldNames.SHORT_NAME}
            name={CustomerInstitutionFieldNames.SHORT_NAME}
            label={t('short_name')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-instituiton-short-name-input' }}
          />
          <StyledField
            aria-label={CustomerInstitutionFieldNames.ARCHIVE_NAME}
            name={CustomerInstitutionFieldNames.ARCHIVE_NAME}
            label={t('archive_name')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-instituiton-archive-name-input' }}
          />
          <StyledField
            aria-label={CustomerInstitutionFieldNames.CNAME}
            name={CustomerInstitutionFieldNames.CNAME}
            label={t('cname')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-instituiton-cname-input' }}
          />
          <StyledField
            aria-label={CustomerInstitutionFieldNames.INSTITUTION_DNS}
            name={CustomerInstitutionFieldNames.INSTITUTION_DNS}
            label={t('institution_dns')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-instituiton-institution-dns-input' }}
          />
          <StyledField
            aria-label={CustomerInstitutionFieldNames.ADMINISTRATION_ID}
            name={CustomerInstitutionFieldNames.ADMINISTRATION_ID}
            label={t('administration_id')}
            component={TextField}
            fullWidth
            variant="outlined"
            inputProps={{ 'data-testid': 'customer-instituiton-administrator-id-input' }}
          />
          <StyledField
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

import React, { FC, useEffect, useState } from 'react';
import Card from '../../components/Card';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, TextField } from '@material-ui/core';
import {
  CustomerInstitutionFieldNames,
  emptyCustomerInstitution,
  emptyInstitutionLogoFile,
  InstitutionLogoFile,
} from '../../types/customerInstitution.types';
import Heading from '../../components/Heading';
import UppyDashboard from '../../components/UppyDashboard';
import { createUppy } from '../../utils/uppy-config';
import Label from '../../components/Label';

const StyledFieldWrapper = styled.div`
  margin: 1rem;
  flex: 1 0 40%;
`;

const StyledButtonContainer = styled.div`
  margin-top: 2rem;
  margin-right: 1rem;
  display: flex;
  justify-content: flex-end;
`;

const AdminCustomerInstitutionPage: FC = () => {
  const { t } = useTranslation('admin');
  const shouldAllowMultipleFiles = false;

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

  const onClickSave = () => {};

  return (
    <Card>
      <Heading>{t('add_institution')}</Heading>
      {uppy && (
        <>
          <Card>
            <Label>{t('institution_logo')}</Label>
            <UppyDashboard uppy={uppy} shouldAllowMultipleFiles={shouldAllowMultipleFiles} />
            {uploadedFile && <div>{uploadedFile.name}</div>}
          </Card>
        </>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          name: Yup.string().required('Required'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}>
        <Form>
          <StyledFieldWrapper>
            <Field
              aria-label={CustomerInstitutionFieldNames.NAME}
              name={CustomerInstitutionFieldNames.NAME}
              label={t('organizationRegisterName')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'customer-instituiton-name-input' }}
            />
          </StyledFieldWrapper>
          <StyledFieldWrapper>
            <Field
              aria-label={CustomerInstitutionFieldNames.DISPLAY_NAME}
              name={CustomerInstitutionFieldNames.DISPLAY_NAME}
              label={t('displayName')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'customer-instituiton-display-name-input' }}
            />
          </StyledFieldWrapper>
          <StyledFieldWrapper>
            <Field
              aria-label={CustomerInstitutionFieldNames.SHORT_NAME}
              name={CustomerInstitutionFieldNames.SHORT_NAME}
              label={t('shortName')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'customer-instituiton-short-name-input' }}
            />
          </StyledFieldWrapper>
          <StyledFieldWrapper>
            <Field
              aria-label={CustomerInstitutionFieldNames.ARCHIVE_NAME}
              name={CustomerInstitutionFieldNames.ARCHIVE_NAME}
              label={t('archiveName')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'customer-instituiton-archive-name-input' }}
            />
          </StyledFieldWrapper>
          <StyledFieldWrapper>
            <Field
              aria-label={CustomerInstitutionFieldNames.CNAME}
              name={CustomerInstitutionFieldNames.CNAME}
              label={t('cname')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'customer-instituiton-cname-input' }}
            />
          </StyledFieldWrapper>
          <StyledFieldWrapper>
            <Field
              aria-label={CustomerInstitutionFieldNames.INSTITUTION_DNS}
              name={CustomerInstitutionFieldNames.INSTITUTION_DNS}
              label={t('institutionDns')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'customer-instituiton-institution-dns-input' }}
            />
          </StyledFieldWrapper>
          <StyledFieldWrapper>
            <Field
              aria-label={CustomerInstitutionFieldNames.ADMINISTRATION_ID}
              name={CustomerInstitutionFieldNames.ADMINISTRATION_ID}
              label={t('administrationId')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'customer-instituiton-administrator-id-input' }}
            />
          </StyledFieldWrapper>
          <StyledFieldWrapper>
            <Field
              aria-label={CustomerInstitutionFieldNames.FEIDE_ORGANIZATION_ID}
              name={CustomerInstitutionFieldNames.FEIDE_ORGANIZATION_ID}
              label={t('feideOrganizationId')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'customer-instituiton-feide-organization-id-input' }}
            />
          </StyledFieldWrapper>
          <StyledButtonContainer>
            <Button
              color="primary"
              data-testid="customer-instituiton-save-button"
              variant="contained"
              onClick={onClickSave}>
              {t('common:save')}
            </Button>
          </StyledButtonContainer>
        </Form>
      </Formik>
    </Card>
  );
};

export default AdminCustomerInstitutionPage;

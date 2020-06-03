import React, { FC } from 'react';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { CircularProgress, TextField } from '@material-ui/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps, Form, Formik, ErrorMessage } from 'formik';
import { useParams, useHistory } from 'react-router-dom';

import Card from '../../components/Card';
import Heading from '../../components/Heading';
import {
  CustomerInstitutionFieldNames,
  CustomerInstitution,
  emptyCustomerInstitution,
} from '../../types/customerInstitution.types';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { createCustomerInstitution, updateCustomerInstitution } from '../../api/customerInstitutionsApi';
import useFetchInstitutions from '../../utils/hooks/useFetchInstitutions';
import InstitutionAutocomplete from '../../components/institution/InstitutionAutocomplete';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import { useFetchCustomerInstitution } from '../../utils/hooks/useFetchCustomerInstitution';

const StyledButtonContainer = styled.div`
  margin-top: 2rem;
  margin-right: 1rem;
  display: flex;
  justify-content: flex-end;
`;

const AdminCustomerInstitutionPage: FC = () => {
  const { t } = useTranslation('admin');
  const { identifier } = useParams();
  const editMode = identifier !== 'new';
  const dispatch = useDispatch();
  const history = useHistory();
  const [institutions, isLoadingInstitutions] = useFetchInstitutions();
  const [customerInstitution, isLoadingCustomerInstitution, handleSetCustomerInstitution] = useFetchCustomerInstitution(
    identifier,
    editMode
  );

  const handleSubmit = async (values: CustomerInstitution) => {
    if (!editMode) {
      const customerValues = { ...values, createdDate: new Date().toISOString() }; // TODO: remove setting createdDate when fixed in backend
      const createdCustomer = await createCustomerInstitution(customerValues);
      if (!createdCustomer || createdCustomer?.error) {
        dispatch(setNotification(createdCustomer.error, NotificationVariant.Error));
      } else {
        history.push(`/admin-institutions/${createdCustomer.identifier}`);
        handleSetCustomerInstitution(createdCustomer);
        dispatch(setNotification(t('feedback:success.created_customer')));
      }
    } else {
      const updatedCustomer = await updateCustomerInstitution(values);
      if (!updatedCustomer || updatedCustomer?.error) {
        dispatch(setNotification(updatedCustomer.error, NotificationVariant.Error));
      } else {
        handleSetCustomerInstitution(updatedCustomer);
        dispatch(setNotification(t('feedback:success.update_customer')));
      }
    }
  };

  return isLoadingCustomerInstitution ? (
    <CircularProgress />
  ) : (
    <Card>
      <Heading>{t(editMode ? 'edit_institution' : 'add_institution')}</Heading>
      <Formik
        enableReinitialize
        initialValues={customerInstitution ?? emptyCustomerInstitution}
        validateOnChange
        validationSchema={Yup.object().shape({
          [CustomerInstitutionFieldNames.NAME]: Yup.string().required(t('feedback.required_field')),
          [CustomerInstitutionFieldNames.DISPLAY_NAME]: Yup.string().required(t('feedback.required_field')),
          [CustomerInstitutionFieldNames.SHORT_NAME]: Yup.string().required(t('feedback.required_field')),
          [CustomerInstitutionFieldNames.ADMINISTRATION_ID]: Yup.string().required(t('feedback.required_field')),
          [CustomerInstitutionFieldNames.FEIDE_ORGANIZATION_ID]: Yup.string().required(t('feedback.required_field')),
        })}
        onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <Field name={CustomerInstitutionFieldNames.NAME}>
              {({ field: { name, value }, form: { setFieldValue }, meta: { touched, error } }: FieldProps) => (
                <InstitutionAutocomplete
                  disabled={editMode}
                  error={touched && !!error}
                  helperText={<ErrorMessage name={name} />}
                  institutions={institutions}
                  isLoading={!editMode && isLoadingInstitutions}
                  onChange={(selectedInstitution) => {
                    setFieldValue(name, selectedInstitution?.name);
                    setFieldValue(CustomerInstitutionFieldNames.DISPLAY_NAME, selectedInstitution?.name);
                    setFieldValue(CustomerInstitutionFieldNames.SHORT_NAME, selectedInstitution?.acronym);
                  }}
                  value={institutions.find((i) => i.name === value) ?? null}
                />
              )}
            </Field>

            <Field name={CustomerInstitutionFieldNames.DISPLAY_NAME}>
              {({ field, meta: { touched, error } }: FieldProps) => (
                <TextField
                  {...field}
                  label={t('display_name')}
                  fullWidth
                  variant="outlined"
                  inputProps={{ 'data-testid': 'customer-institution-display-name-input' }}
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>

            <Field name={CustomerInstitutionFieldNames.SHORT_NAME}>
              {({ field, meta: { touched, error } }: FieldProps) => (
                <TextField
                  {...field}
                  label={t('short_name')}
                  fullWidth
                  variant="outlined"
                  inputProps={{ 'data-testid': 'customer-institution-short-name-input' }}
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>

            <Field name={CustomerInstitutionFieldNames.ARCHIVE_NAME}>
              {({ field }: FieldProps) => (
                <TextField
                  {...field}
                  label={t('archive_name')}
                  fullWidth
                  variant="outlined"
                  inputProps={{ 'data-testid': 'customer-institution-archive-name-input' }}
                />
              )}
            </Field>

            <Field name={CustomerInstitutionFieldNames.CNAME}>
              {({ field }: FieldProps) => (
                <TextField
                  {...field}
                  label={t('cname')}
                  fullWidth
                  variant="outlined"
                  inputProps={{ 'data-testid': 'customer-institution-cname-input' }}
                />
              )}
            </Field>

            <Field name={CustomerInstitutionFieldNames.INSTITUTION_DNS}>
              {({ field }: FieldProps) => (
                <TextField
                  {...field}
                  label={t('institution_dns')}
                  fullWidth
                  variant="outlined"
                  inputProps={{ 'data-testid': 'customer-institution-institution-dns-input' }}
                />
              )}
            </Field>

            <Field name={CustomerInstitutionFieldNames.ADMINISTRATION_ID}>
              {({ field, meta: { touched, error } }: FieldProps) => (
                <TextField
                  {...field}
                  label={t('administration_id')}
                  fullWidth
                  variant="outlined"
                  inputProps={{ 'data-testid': 'customer-institution-administrator-id-input' }}
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>

            <Field name={CustomerInstitutionFieldNames.FEIDE_ORGANIZATION_ID}>
              {({ field, meta: { touched, error } }: FieldProps) => (
                <TextField
                  {...field}
                  label={t('feide_organization_id')}
                  fullWidth
                  variant="outlined"
                  inputProps={{ 'data-testid': 'customer-institution-feide-organization-id-input' }}
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>

            <StyledButtonContainer>
              <ButtonWithProgress data-testid="customer-institution-save-button" isLoading={isSubmitting} type="submit">
                {editMode ? t('common:save') : t('common:create')}
              </ButtonWithProgress>
            </StyledButtonContainer>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default AdminCustomerInstitutionPage;

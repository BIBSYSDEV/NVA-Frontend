import React, { FC, useEffect, useState } from 'react';
import Card from '../../components/Card';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import Heading from '../../components/Heading';
import styled from 'styled-components';
import * as Yup from 'yup';
import {
  CustomerInstitutionFieldNames,
  emptyCustomerInstitution,
  CustomerInstitution,
} from '../../types/customerInstitution.types';
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
import useFetchInstitutions from '../../utils/hooks/useFetchInstitutions';
import InstitutionAutocomplete from '../../components/institution/InstitutionAutocomplete';
import ButtonWithProgress from '../../components/ButtonWithProgress';

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
  const [initialValues, setInitialValues] = useState<CustomerInstitution>(emptyCustomerInstitution);
  const [isLoading, setIsLoading] = useState(editMode);
  const dispatch = useDispatch();
  const history = useHistory();
  const [institutions, isLoadingInstitutions] = useFetchInstitutions();

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
      if (!updatedCustomer || updatedCustomer?.error) {
        dispatch(setNotification(updatedCustomer.error, NotificationVariant.Error));
      } else {
        setInitialValues(updatedCustomer);
        dispatch(setNotification(t('feedback:success.update_customer')));
      }
    }
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
        {({ isSubmitting }) => (
          <Form>
            <Field name={CustomerInstitutionFieldNames.NAME}>
              {({ field: { name, value }, form: { setFieldValue } }: FieldProps) => (
                <InstitutionAutocomplete
                  institutions={institutions}
                  isLoading={isLoadingInstitutions}
                  value={institutions.find((i) => i.name === value) ?? null}
                  onChange={(value) => {
                    setFieldValue(name, value?.name ?? '');
                    setFieldValue(CustomerInstitutionFieldNames.DISPLAY_NAME, value?.name ?? '');
                    setFieldValue(CustomerInstitutionFieldNames.SHORT_NAME, value?.acronym ?? '');
                  }}
                  disabled={editMode}
                />
              )}
            </Field>

            <Field
              name={CustomerInstitutionFieldNames.DISPLAY_NAME}
              aria-label={t('display_name')}
              label={t('display_name')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'customer-institution-display-name-input' }}
            />
            <Field
              name={CustomerInstitutionFieldNames.SHORT_NAME}
              aria-label={t('short_name')}
              label={t('short_name')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'customer-institution-short-name-input' }}
            />
            <Field
              name={CustomerInstitutionFieldNames.ARCHIVE_NAME}
              aria-label={t('archive_name')}
              label={t('archive_name')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'customer-institution-archive-name-input' }}
            />
            <Field
              name={CustomerInstitutionFieldNames.CNAME}
              aria-label={t('cname')}
              label={t('cname')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'customer-institution-cname-input' }}
            />
            <Field
              name={CustomerInstitutionFieldNames.INSTITUTION_DNS}
              aria-label={t('institution_dns')}
              label={t('institution_dns')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'customer-institution-institution-dns-input' }}
            />
            <Field
              name={CustomerInstitutionFieldNames.ADMINISTRATION_ID}
              aria-label={t('administration_id')}
              label={t('administration_id')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'customer-institution-administrator-id-input' }}
            />
            <Field
              name={CustomerInstitutionFieldNames.FEIDE_ORGANIZATION_ID}
              aria-label={t('feide_organization_id')}
              label={t('feide_organization_id')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'customer-institution-feide-organization-id-input' }}
            />
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

import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Form, Formik } from 'formik';
import { useHistory } from 'react-router-dom';

import Card from '../../components/Card';
import Heading from '../../components/Heading';
import {
  CustomerInstitution,
  emptyCustomerInstitution,
  CustomerInstitutionFieldNames,
} from '../../types/customerInstitution.types';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { createCustomerInstitution, updateCustomerInstitution } from '../../api/customerInstitutionsApi';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import { StyledRightAlignedWrapper } from '../../components/styled/Wrappers';
import { customerInstitutionValidationSchema } from '../../utils/validation/customerInstitutionValidation';
import { SelectInstitutionField, CustomerInstitutionTextField } from './customerInstitutionFields';
import { getAdminInstitutionPath } from '../../utils/urlPaths';

const StyledButtonContainer = styled(StyledRightAlignedWrapper)`
  margin-top: 2rem;
`;

const StyledCard = styled(Card)`
  min-width: 60vw;
`;

interface CustomerInstitutionMetadataFormProps {
  customerInstitution: CustomerInstitution;
  handleSetCustomerInstitution: (customerInstitution: CustomerInstitution) => void;
  editMode: boolean;
}

const CustomerInstitutionMetadataForm: FC<CustomerInstitutionMetadataFormProps> = ({
  customerInstitution,
  handleSetCustomerInstitution,
  editMode,
}) => {
  const { t } = useTranslation('admin');
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSubmit = async (values: CustomerInstitution) => {
    if (!editMode) {
      const createdCustomer = await createCustomerInstitution(values);
      if (!createdCustomer || createdCustomer?.error) {
        dispatch(setNotification(createdCustomer.error, NotificationVariant.Error));
      } else {
        history.push(getAdminInstitutionPath(createdCustomer.id));
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

  return (
    <StyledCard>
      <Heading>{t('common:institution')}</Heading>
      <Formik
        enableReinitialize
        initialValues={{ ...emptyCustomerInstitution, ...customerInstitution }}
        validateOnChange
        validationSchema={customerInstitutionValidationSchema}
        onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form noValidate>
            <SelectInstitutionField disabled={editMode} />
            <CustomerInstitutionTextField
              name={CustomerInstitutionFieldNames.DISPLAY_NAME}
              label={t('display_name')}
              required
              dataTestId="customer-institution-display-name-input"
            />
            <CustomerInstitutionTextField
              name={CustomerInstitutionFieldNames.SHORT_NAME}
              label={t('short_name')}
              required
              dataTestId="customer-institution-short-name-input"
            />
            <CustomerInstitutionTextField
              name={CustomerInstitutionFieldNames.ARCHIVE_NAME}
              label={t('archive_name')}
              dataTestId="customer-institution-archive-name-input"
            />
            <CustomerInstitutionTextField
              name={CustomerInstitutionFieldNames.FEIDE_ORGANIZATION_ID}
              label={t('feide_organization_id')}
              required
              dataTestId="customer-institution-feide-organization-id-input"
            />
            <StyledButtonContainer>
              <ButtonWithProgress data-testid="customer-institution-save-button" isLoading={isSubmitting} type="submit">
                {editMode ? t('common:save') : t('common:create')}
              </ButtonWithProgress>
            </StyledButtonContainer>
          </Form>
        )}
      </Formik>
    </StyledCard>
  );
};

export default CustomerInstitutionMetadataForm;

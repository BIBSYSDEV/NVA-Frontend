import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Form, Formik } from 'formik';
import { useHistory } from 'react-router-dom';

import Card from '../../components/Card';
import Heading from '../../components/Heading';
import { CustomerInstitution, emptyCustomerInstitution } from '../../types/customerInstitution.types';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { createCustomerInstitution, updateCustomerInstitution } from '../../api/customerInstitutionsApi';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import { StyledRightAlignedButtonWrapper } from '../../components/styled/Wrappers';
import { customerInstitutionValidationSchema } from '../../utils/validation/customerInstitutionValidation';
import {
  SelectInstitutionField,
  DisplayNameField,
  ShortNameField,
  ArchiveNameField,
  FeideOrganizationIdField,
} from './customerInstitutionFields';

const StyledButtonContainer = styled(StyledRightAlignedButtonWrapper)`
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
        history.push(`/admin-institutions?id=${encodeURIComponent(createdCustomer.id)}`);
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
          <Form>
            <SelectInstitutionField disabled={editMode} />
            <DisplayNameField />
            <ShortNameField />
            <ArchiveNameField />
            <FeideOrganizationIdField />
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

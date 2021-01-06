import React, { FC } from 'react';
import { Formik, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import {
  emptyCustomerInstitution,
  CustomerInstitution,
  CustomerInstitutionFieldNames,
} from '../../types/customerInstitution.types';
import { PageHeader } from '../../components/PageHeader';
import { useFetchCustomerInstitution } from '../../utils/hooks/useFetchCustomerInstitution';
import { RootStore } from '../../redux/reducers/rootReducer';
import { myInstitutionValidationSchema } from '../../utils/validation/customerInstitutionValidation';
import { SelectInstitutionField, CustomerInstitutionTextField } from './customerInstitutionFields';
import Card from '../../components/Card';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import { updateCustomerInstitution } from '../../api/customerInstitutionsApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import ListSkeleton from '../../components/ListSkeleton';
import { StyledRightAlignedWrapper } from '../../components/styled/Wrappers';

const StyledButtonContainer = styled(StyledRightAlignedWrapper)`
  margin-top: 2rem;
`;

const MyCustomerInstitutionPage: FC = () => {
  const { t } = useTranslation('admin');
  const dispatch = useDispatch();
  const { user } = useSelector((store: RootStore) => store);
  const [customerInstitution, isLoadingCustomerInstitution, handleSetCustomerInstitution] = useFetchCustomerInstitution(
    user?.customerId ?? ''
  );

  const handleSubmit = async (values: CustomerInstitution) => {
    const updatedCustomer = await updateCustomerInstitution(values);
    if (!updatedCustomer || updatedCustomer?.error) {
      dispatch(setNotification(updatedCustomer.error, NotificationVariant.Error));
    } else {
      handleSetCustomerInstitution(updatedCustomer);
      dispatch(setNotification(t('feedback:success.update_customer')));
    }
  };

  return (
    <>
      <PageHeader>{t('common:my_institution')}</PageHeader>
      <Card>
        {isLoadingCustomerInstitution ? (
          <ListSkeleton arrayLength={4} minWidth={100} height={80} />
        ) : (
          <Formik
            enableReinitialize
            initialValues={{ ...emptyCustomerInstitution, ...customerInstitution }}
            validateOnChange
            validationSchema={myInstitutionValidationSchema}
            onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form noValidate>
                <SelectInstitutionField disabled />
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
                <StyledButtonContainer>
                  <ButtonWithProgress
                    data-testid="customer-institution-save-button"
                    isLoading={isSubmitting}
                    type="submit">
                    {t('common:save')}
                  </ButtonWithProgress>
                </StyledButtonContainer>
              </Form>
            )}
          </Formik>
        )}
      </Card>
    </>
  );
};

export default MyCustomerInstitutionPage;

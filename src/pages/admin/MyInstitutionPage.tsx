import React, { FC } from 'react';
import { Formik, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { emptyCustomerInstitution, CustomerInstitution } from '../../types/customerInstitution.types';
import { PageHeader } from '../../components/PageHeader';
import { useFetchCustomerInstitution } from '../../utils/hooks/useFetchCustomerInstitution';
import { RootStore } from '../../redux/reducers/rootReducer';
import { myInstitutionValidationSchema } from '../../utils/validation/customerInstitutionValidation';
import {
  SelectInstitutionField,
  DisplayNameField,
  ShortNameField,
  ArchiveNameField,
} from './customerInstitutionFields';
import Card from '../../components/Card';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import { updateCustomerInstitution } from '../../api/customerInstitutionsApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import ListSkeleton from '../../components/ListSkeleton';
import { StyledRightAlignedButtonWrapper } from '../../components/styled/Wrappers';

const StyledButtonContainer = styled(StyledRightAlignedButtonWrapper)`
  margin-top: 2rem;
`;

const MyCustomerInstitutionPage: FC = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const { customerId } = useSelector((store: RootStore) => store.user);
  const [customerInstitution, isLoadingCustomerInstitution, handleSetCustomerInstitution] = useFetchCustomerInstitution(
    customerId ?? ''
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
      <PageHeader>{t('my_institution')}</PageHeader>
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
              <Form>
                <SelectInstitutionField disabled />
                <DisplayNameField />
                <ShortNameField />
                <ArchiveNameField />
                <StyledButtonContainer>
                  <ButtonWithProgress
                    data-testid="customer-institution-save-button"
                    isLoading={isSubmitting}
                    type="submit">
                    {t('save')}
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

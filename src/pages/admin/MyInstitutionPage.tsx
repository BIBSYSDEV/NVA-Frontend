import { Form, Formik } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import SaveIcon from '@material-ui/icons/Save';
import { updateCustomerInstitution } from '../../api/customerInstitutionsApi';
import BackgroundDiv from '../../components/BackgroundDiv';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import Card from '../../components/Card';
import ListSkeleton from '../../components/ListSkeleton';
import { PageHeader } from '../../components/PageHeader';
import { StyledRightAlignedWrapper } from '../../components/styled/Wrappers';
import { setNotification } from '../../redux/actions/notificationActions';
import { RootStore } from '../../redux/reducers/rootReducer';
import {
  CustomerInstitution,
  CustomerInstitutionFieldNames,
  emptyCustomerInstitution,
} from '../../types/customerInstitution.types';
import { NotificationVariant } from '../../types/notification.types';
import { useFetchCustomerInstitution } from '../../utils/hooks/useFetchCustomerInstitution';
import { myInstitutionValidationSchema } from '../../utils/validation/customerInstitutionValidation';
import { CustomerInstitutionTextField, SelectInstitutionField } from './customerInstitutionFields';

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
    <BackgroundDiv>
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
                    color="secondary"
                    isLoading={isSubmitting}
                    startIcon={<SaveIcon />}
                    type="submit">
                    {t('common:save')}
                  </ButtonWithProgress>
                </StyledButtonContainer>
              </Form>
            )}
          </Formik>
        )}
      </Card>
    </BackgroundDiv>
  );
};

export default MyCustomerInstitutionPage;

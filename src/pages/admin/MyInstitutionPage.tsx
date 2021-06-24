import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import SaveIcon from '@material-ui/icons/Save';
import { updateCustomerInstitution } from '../../api/customerInstitutionsApi';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import ListSkeleton from '../../components/ListSkeleton';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth, StyledRightAlignedWrapper } from '../../components/styled/Wrappers';
import { setNotification } from '../../redux/actions/notificationActions';
import { RootStore } from '../../redux/reducers/rootReducer';
import {
  CustomerInstitution,
  CustomerInstitutionFieldNames,
  emptyCustomerInstitution,
} from '../../types/customerInstitution.types';
import { NotificationVariant } from '../../types/notification.types';
import { myInstitutionValidationSchema } from '../../utils/validation/customerInstitutionValidation';
import { CustomerInstitutionTextField } from './customerInstitutionFields/CustomerInstitutionTextField';
import { SelectInstitutionField } from './customerInstitutionFields/SelectInstitutionField';
import BackgroundDiv from '../../components/BackgroundDiv';
import lightTheme from '../../themes/lightTheme';
import { isErrorStatus, isSuccessStatus, useFetch } from '../../utils/hooks/useFetch';

const StyledButtonContainer = styled(StyledRightAlignedWrapper)`
  margin-top: 2rem;
`;

const MyCustomerInstitutionPage = () => {
  const { t } = useTranslation('admin');
  const dispatch = useDispatch();
  const { user } = useSelector((store: RootStore) => store);
  const [customerInstitution, isLoadingCustomerInstitution] = useFetch<CustomerInstitution>({
    url: user?.customerId ?? '',
    errorMessage: t('feedback:error.get_customer'),
    withAuthentication: true,
  });

  const handleSubmit = async (values: CustomerInstitution) => {
    const updateCustomerResponse = await updateCustomerInstitution(values);
    if (isErrorStatus(updateCustomerResponse.status)) {
      dispatch(setNotification(t('feedback:error.update_customer'), NotificationVariant.Error));
    } else if (isSuccessStatus(updateCustomerResponse.status)) {
      dispatch(setNotification(t('feedback:success.update_customer')));
    }
  };

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('common:my_institution')}</PageHeader>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.light}>
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
                  dataTestId="customer-institution-display-name-field"
                />
                <CustomerInstitutionTextField
                  name={CustomerInstitutionFieldNames.SHORT_NAME}
                  label={t('short_name')}
                  required
                  dataTestId="customer-institution-short-name-field"
                />
                <CustomerInstitutionTextField
                  name={CustomerInstitutionFieldNames.ARCHIVE_NAME}
                  label={t('archive_name')}
                  dataTestId="customer-institution-archive-name-field"
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
      </BackgroundDiv>
    </StyledPageWrapperWithMaxWidth>
  );
};

export default MyCustomerInstitutionPage;

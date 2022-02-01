import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { updateCustomerInstitution } from '../../api/customerInstitutionsApi';
import { ListSkeleton } from '../../components/ListSkeleton';
import { PageHeader } from '../../components/PageHeader';
import {
  InputContainerBox,
  SyledPageContent,
  StyledRightAlignedWrapper,
  BackgroundDiv,
} from '../../components/styled/Wrappers';
import { setNotification } from '../../redux/actions/notificationActions';
import { RootStore } from '../../redux/reducers/rootReducer';
import {
  CustomerInstitution,
  CustomerInstitutionFieldNames,
  emptyCustomerInstitution,
} from '../../types/customerInstitution.types';
import { myInstitutionValidationSchema } from '../../utils/validation/customerInstitutionValidation';
import { CustomerInstitutionTextField } from './customerInstitutionFields/CustomerInstitutionTextField';
import { SelectInstitutionField } from './customerInstitutionFields/SelectInstitutionField';
import { useFetch } from '../../utils/hooks/useFetch';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';

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
      dispatch(setNotification(t('feedback:error.update_customer'), 'error'));
    } else if (isSuccessStatus(updateCustomerResponse.status)) {
      dispatch(setNotification(t('feedback:success.update_customer')));
    }
  };

  const initialValues: CustomerInstitution = {
    ...emptyCustomerInstitution,
    ...customerInstitution,
  };

  return (
    <SyledPageContent>
      <PageHeader>{t('common:my_institution')}</PageHeader>
      <BackgroundDiv>
        {isLoadingCustomerInstitution ? (
          <ListSkeleton arrayLength={4} minWidth={100} height={80} />
        ) : (
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validateOnChange
            validationSchema={myInstitutionValidationSchema}
            onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form noValidate>
                <InputContainerBox>
                  <SelectInstitutionField fieldName={CustomerInstitutionFieldNames.Name} disabled />
                  <CustomerInstitutionTextField
                    name={CustomerInstitutionFieldNames.DisplayName}
                    label={t('display_name')}
                    required
                    dataTestId={dataTestId.institutionAdmin.displayNameField}
                  />
                  <CustomerInstitutionTextField
                    name={CustomerInstitutionFieldNames.ShortName}
                    label={t('short_name')}
                    required
                    dataTestId={dataTestId.institutionAdmin.shortNameField}
                  />
                  <CustomerInstitutionTextField
                    name={CustomerInstitutionFieldNames.ArchiveName}
                    label={t('archive_name')}
                    dataTestId={dataTestId.institutionAdmin.archiveNameField}
                  />
                  <StyledRightAlignedWrapper>
                    <LoadingButton
                      data-testid={dataTestId.institutionAdmin.saveButton}
                      variant="contained"
                      loading={isSubmitting}
                      startIcon={<SaveIcon />}
                      loadingPosition="start"
                      type="submit">
                      {t('common:save')}
                    </LoadingButton>
                  </StyledRightAlignedWrapper>
                </InputContainerBox>
              </Form>
            )}
          </Formik>
        )}
      </BackgroundDiv>
    </SyledPageContent>
  );
};

export default MyCustomerInstitutionPage;

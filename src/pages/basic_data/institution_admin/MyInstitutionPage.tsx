import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { updateCustomerInstitution } from '../../../api/customerInstitutionsApi';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { PageHeader } from '../../../components/PageHeader';
import { InputContainerBox, SyledPageContent, StyledRightAlignedWrapper } from '../../../components/styled/Wrappers';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import {
  CustomerInstitution,
  CustomerInstitutionFieldNames,
  emptyCustomerInstitution,
} from '../../../types/customerInstitution.types';
import { myInstitutionValidationSchema } from '../../../utils/validation/customerInstitutionValidation';
import { useFetch } from '../../../utils/hooks/useFetch';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { CustomerInstitutionTextField } from '../app_admin/CustomerInstitutionTextField';

export const MyCustomerInstitutionPage = () => {
  const { t } = useTranslation('admin');
  const dispatch = useDispatch();
  const { user } = useSelector((store: RootState) => store);
  const [customerInstitution, isLoadingCustomerInstitution] = useFetch<CustomerInstitution>({
    url: user?.customerId ?? '',
    errorMessage: t('feedback:error.get_customer'),
    withAuthentication: true,
  });

  const handleSubmit = async (values: CustomerInstitution) => {
    const updateCustomerResponse = await updateCustomerInstitution(values);
    if (isErrorStatus(updateCustomerResponse.status)) {
      dispatch(setNotification({ message: t('feedback:error.update_customer'), variant: 'error' }));
    } else if (isSuccessStatus(updateCustomerResponse.status)) {
      dispatch(setNotification({ message: t('feedback:success.update_customer'), variant: 'success' }));
    }
  };

  const initialValues: CustomerInstitution = {
    ...emptyCustomerInstitution,
    ...customerInstitution,
  };

  return (
    <SyledPageContent>
      <PageHeader>{t('common:my_institution')}</PageHeader>
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
                <CustomerInstitutionTextField
                  name={CustomerInstitutionFieldNames.Name}
                  label={t('common:institution')}
                  required
                  disabled
                  dataTestId={dataTestId.organization.searchField}
                />
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
    </SyledPageContent>
  );
};

import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import { Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import {
  CustomerInstitution,
  emptyCustomerInstitution,
  CustomerInstitutionFieldNames,
} from '../../types/customerInstitution.types';
import { setNotification } from '../../redux/actions/notificationActions';
import { createCustomerInstitution, updateCustomerInstitution } from '../../api/customerInstitutionsApi';
import { InputContainerBox, StyledRightAlignedWrapper } from '../../components/styled/Wrappers';
import { customerInstitutionValidationSchema } from '../../utils/validation/customerInstitutionValidation';
import { CustomerInstitutionTextField } from './customerInstitutionFields/CustomerInstitutionTextField';
import { SelectInstitutionField } from './customerInstitutionFields/SelectInstitutionField';
import { getAdminInstitutionPath } from '../../utils/urlPaths';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';

interface CustomerInstitutionMetadataFormProps {
  customerInstitution: CustomerInstitution;
  editMode: boolean;
}

export const CustomerInstitutionMetadataForm = ({
  customerInstitution,
  editMode,
}: CustomerInstitutionMetadataFormProps) => {
  const { t } = useTranslation('admin');
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSubmit = async (values: CustomerInstitution) => {
    if (!editMode) {
      const createCustomerResponse = await createCustomerInstitution(values);
      if (isErrorStatus(createCustomerResponse.status)) {
        dispatch(setNotification(t('feedback:error.create_customer'), 'error'));
      } else if (isSuccessStatus(createCustomerResponse.status)) {
        history.push(getAdminInstitutionPath(createCustomerResponse.data.id));
        dispatch(setNotification(t('feedback:success.created_customer')));
      }
    } else {
      const updateCustomerResponse = await updateCustomerInstitution(values);
      if (isErrorStatus(updateCustomerResponse.status)) {
        dispatch(setNotification(t('feedback:error.update_customer'), 'error'));
      } else if (isSuccessStatus(updateCustomerResponse.status)) {
        dispatch(setNotification(t('feedback:success.update_customer')));
      }
    }
  };

  return (
    <>
      <Typography variant="h2" paragraph>
        {t('common:institution')}
      </Typography>
      <Formik
        enableReinitialize
        initialValues={{ ...emptyCustomerInstitution, ...customerInstitution }}
        validateOnChange
        validationSchema={customerInstitutionValidationSchema}
        onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form noValidate>
            <InputContainerBox>
              <SelectInstitutionField disabled={editMode} />
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
              <CustomerInstitutionTextField
                name={CustomerInstitutionFieldNames.FeideOrganizationId}
                label={t('feide_organization_id')}
                required
                dataTestId={dataTestId.institutionAdmin.feideField}
              />
              <StyledRightAlignedWrapper>
                <LoadingButton
                  data-testid={dataTestId.institutionAdmin.saveButton}
                  variant="contained"
                  startIcon={<SaveIcon />}
                  loadingPosition="start"
                  loading={isSubmitting}
                  type="submit">
                  {editMode ? t('common:save') : t('common:create')}
                </LoadingButton>
              </StyledRightAlignedWrapper>
            </InputContainerBox>
          </Form>
        )}
      </Formik>
    </>
  );
};

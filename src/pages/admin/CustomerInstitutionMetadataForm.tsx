import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Form, Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import SaveIcon from '@material-ui/icons/Save';

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
import BackgroundDiv from '../../components/BackgroundDiv';
import lightTheme from '../../themes/lightTheme';

const StyledButtonContainer = styled(StyledRightAlignedWrapper)`
  margin-top: 2rem;
`;

interface CustomerInstitutionMetadataFormProps {
  customerInstitution: CustomerInstitution;
  handleSetCustomerInstitution: (customerInstitution: CustomerInstitution) => void;
  editMode: boolean;
}

export const CustomerInstitutionMetadataForm = ({
  customerInstitution,
  handleSetCustomerInstitution,
  editMode,
}: CustomerInstitutionMetadataFormProps) => {
  const { t } = useTranslation('admin');
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSubmit = async (values: CustomerInstitution) => {
    if (!editMode) {
      const createCustomerResponse = await createCustomerInstitution(values);
      if (createCustomerResponse) {
        if (createCustomerResponse.error) {
          dispatch(setNotification(t('feedback:error.create_customer'), NotificationVariant.Error));
        } else if (createCustomerResponse.data) {
          history.push(getAdminInstitutionPath(createCustomerResponse.data.id));
          handleSetCustomerInstitution(createCustomerResponse.data);
          dispatch(setNotification(t('feedback:success.created_customer')));
        }
      }
    } else {
      const updateCustomerResponse = await updateCustomerInstitution(values);
      if (updateCustomerResponse) {
        if (updateCustomerResponse.error) {
          dispatch(setNotification(t('feedback:error.update_customer'), NotificationVariant.Error));
        } else if (updateCustomerResponse.data) {
          handleSetCustomerInstitution(updateCustomerResponse.data);
          dispatch(setNotification(t('feedback:success.update_customer')));
        }
      }
    }
  };

  return (
    <BackgroundDiv backgroundColor={lightTheme.palette.section.light}>
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
              <ButtonWithProgress
                data-testid="customer-institution-save-button"
                color="secondary"
                startIcon={<SaveIcon />}
                isLoading={isSubmitting}
                type="submit">
                {editMode ? t('common:save') : t('common:create')}
              </ButtonWithProgress>
            </StyledButtonContainer>
          </Form>
        )}
      </Formik>
    </BackgroundDiv>
  );
};

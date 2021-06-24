import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Form, Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

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
import { CustomerInstitutionTextField } from './customerInstitutionFields/CustomerInstitutionTextField';
import { SelectInstitutionField } from './customerInstitutionFields/SelectInstitutionField';
import { getAdminInstitutionPath } from '../../utils/urlPaths';
import BackgroundDiv from '../../components/BackgroundDiv';
import lightTheme from '../../themes/lightTheme';
import { isErrorStatus, isSuccessStatus } from '../../utils/hooks/useFetch';

const StyledButtonContainer = styled(StyledRightAlignedWrapper)`
  margin-top: 2rem;
`;

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
        dispatch(setNotification(t('feedback:error.create_customer'), NotificationVariant.Error));
      } else if (isSuccessStatus(createCustomerResponse.status)) {
        history.push(getAdminInstitutionPath(createCustomerResponse.data.id));
        dispatch(setNotification(t('feedback:success.created_customer')));
      }
    } else {
      const updateCustomerResponse = await updateCustomerInstitution(values);
      if (isErrorStatus(updateCustomerResponse.status)) {
        dispatch(setNotification(t('feedback:error.update_customer'), NotificationVariant.Error));
      } else if (isSuccessStatus(updateCustomerResponse.status)) {
        dispatch(setNotification(t('feedback:success.update_customer')));
      }
    }
  };

  return (
    <BackgroundDiv backgroundColor={lightTheme.palette.section.megaLight}>
      <Typography variant="h2">{t('common:institution')}</Typography>
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
            <CustomerInstitutionTextField
              name={CustomerInstitutionFieldNames.FEIDE_ORGANIZATION_ID}
              label={t('feide_organization_id')}
              required
              dataTestId="customer-institution-feide-organization-id-field"
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

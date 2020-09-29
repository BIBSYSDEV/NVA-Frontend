import React, { useState, FC } from 'react';
import { Formik, Form, Field, FieldProps, FormikValues, ErrorMessage } from 'formik';
import { Collapse, Button, TextField, CircularProgress } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { emptyNewContributor } from '../../../../types/contributor.types';
import { createAuthority } from '../../../../api/authorityApi';
import { Authority } from '../../../../types/authority.types';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../../types/notification.types';
import {
  StyledProgressWrapper,
  StyledRightAlignedButtonWrapper,
  StyledNormalTextPreWrapped,
} from '../../../../components/styled/Wrappers';
import { newContributorValidationSchema } from '../../../../utils/validation/newContributorValidation';

const StyledButtonContainer = styled(StyledRightAlignedButtonWrapper)`
  margin-top: 1rem;
`;

interface CreateContributorModalContentProps {
  addAuthor: (author: Authority) => void;
  handleCloseModal: () => void;
}

const CreateContributorModalContent: FC<CreateContributorModalContentProps> = ({ addAuthor, handleCloseModal }) => {
  const [readMore, setReadMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const toggleReadMore = () => setReadMore(!readMore);

  const handleSubmit = async (values: FormikValues) => {
    setLoading(true);
    const createdAuthority = await createAuthority(values.firstName, values.lastName);
    if (createdAuthority?.error) {
      dispatch(setNotification(createdAuthority.error, NotificationVariant.Error));
    } else {
      addAuthor(createdAuthority);
    }
    handleCloseModal();
  };

  return (
    <>
      {loading ? (
        <StyledProgressWrapper>
          <CircularProgress size={100} />
        </StyledProgressWrapper>
      ) : (
        <Formik
          initialValues={emptyNewContributor}
          validationSchema={newContributorValidationSchema}
          onSubmit={handleSubmit}>
          {({ isValid, isSubmitting, dirty }) => (
            <Form>
              <Collapse in={readMore} collapsedHeight="4.5rem">
                <StyledNormalTextPreWrapped>{t('description_create_authority')}</StyledNormalTextPreWrapped>
              </Collapse>
              <StyledRightAlignedButtonWrapper>
                <Button color="primary" data-testid="button-read-more" onClick={toggleReadMore}>
                  {t(readMore ? 'read_less' : 'read_more')}
                </Button>
              </StyledRightAlignedButtonWrapper>
              <Field name="firstName">
                {({ field, meta: { error, touched } }: FieldProps) => (
                  <TextField
                    {...field}
                    aria-label="first name"
                    fullWidth
                    label={t('first_name')}
                    variant="outlined"
                    error={!!error && touched}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <Field name="lastName">
                {({ field, meta: { error, touched } }: FieldProps) => (
                  <TextField
                    {...field}
                    aria-label="last name"
                    fullWidth
                    label={t('last_name')}
                    variant="outlined"
                    error={!!error && touched}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <StyledButtonContainer>
                <Button type="submit" color="primary" variant="contained" disabled={!isValid || !dirty || isSubmitting}>
                  {t('create_authority')}
                </Button>
              </StyledButtonContainer>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default CreateContributorModalContent;

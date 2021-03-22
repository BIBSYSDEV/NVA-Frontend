import { ErrorMessage, Field, FieldProps, Form, Formik, FormikValues } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, Collapse, DialogActions, TextField } from '@material-ui/core';
import { createAuthority } from '../../../../api/authorityApi';
import BackgroundDiv from '../../../../components/BackgroundDiv';
import { StyledNormalTextPreWrapped, StyledRightAlignedWrapper } from '../../../../components/styled/Wrappers';
import { setNotification } from '../../../../redux/actions/notificationActions';
import lightTheme from '../../../../themes/lightTheme';
import { Authority } from '../../../../types/authority.types';
import { emptyNewContributor } from '../../../../types/contributor.types';
import { NotificationVariant } from '../../../../types/notification.types';
import { newContributorValidationSchema } from '../../../../utils/validation/newContributorValidation';
import ButtonWithProgress from '../../../../components/ButtonWithProgress';

const StyledBackgroundDiv = styled(BackgroundDiv)`
  padding: 0;
`;

interface CreateContributorModalContentProps {
  addAuthor: (author: Authority) => void;
  handleCloseModal: () => void;
}

const CreateContributorModalContent = ({ addAuthor, handleCloseModal }: CreateContributorModalContentProps) => {
  const [readMore, setReadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const toggleReadMore = () => setReadMore(!readMore);

  const handleSubmit = async (values: FormikValues) => {
    setIsLoading(true);
    const createdAuthority = await createAuthority(values.firstName, values.lastName);
    if (createdAuthority?.error) {
      dispatch(setNotification(createdAuthority.error, NotificationVariant.Error));
    } else {
      addAuthor(createdAuthority);
    }
    handleCloseModal();
  };

  return (
    <StyledBackgroundDiv backgroundColor={lightTheme.palette.background.paper}>
      <Formik
        initialValues={emptyNewContributor}
        validationSchema={newContributorValidationSchema}
        onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form noValidate>
            <Collapse in={readMore} collapsedHeight="4.5rem">
              <StyledNormalTextPreWrapped>
                {t('registration:contributors.create_new_author_description')}
              </StyledNormalTextPreWrapped>
            </Collapse>
            <StyledRightAlignedWrapper>
              <Button color="primary" data-testid="button-read-more" onClick={toggleReadMore}>
                {t(readMore ? 'read_less' : 'read_more')}
              </Button>
            </StyledRightAlignedWrapper>
            <Field name="firstName">
              {({ field, meta: { error, touched } }: FieldProps) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t('first_name')}
                  required
                  disabled={isSubmitting}
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
                  fullWidth
                  label={t('last_name')}
                  required
                  disabled={isSubmitting}
                  variant="outlined"
                  error={!!error && touched}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>
            <DialogActions>
              <Button onClick={handleCloseModal}>{t('common:close')}</Button>
              <ButtonWithProgress
                data-testid="button-create-authority"
                type="submit"
                color="primary"
                variant="contained"
                isLoading={isLoading}
                disabled={isSubmitting}>
                {t('profile:authority.create_authority')}
              </ButtonWithProgress>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </StyledBackgroundDiv>
  );
};

export default CreateContributorModalContent;

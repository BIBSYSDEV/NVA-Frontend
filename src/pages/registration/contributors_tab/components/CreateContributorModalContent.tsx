import { ErrorMessage, Field, FieldProps, Form, Formik, FormikValues } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, Collapse, DialogActions, TextField } from '@material-ui/core';
import { createAuthority } from '../../../../api/authorityApi';
import BackgroundDiv from '../../../../components/BackgroundDiv';
import { StyledTypographyPreWrapped, StyledRightAlignedWrapper } from '../../../../components/styled/Wrappers';
import { setNotification } from '../../../../redux/actions/notificationActions';
import lightTheme from '../../../../themes/lightTheme';
import { Authority } from '../../../../types/authority.types';
import { emptyNewContributor } from '../../../../types/contributor.types';
import { NotificationVariant } from '../../../../types/notification.types';
import { newContributorValidationSchema } from '../../../../utils/validation/newContributorValidation';
import ButtonWithProgress from '../../../../components/ButtonWithProgress';
import { isErrorStatus, isSuccessStatus } from '../../../../utils/constants';

const StyledBackgroundDiv = styled(BackgroundDiv)`
  padding: 0;
`;

interface CreateContributorModalContentProps {
  addContributor: (authority: Authority) => void;
  handleCloseModal: () => void;
}

export const CreateContributorModalContent = ({
  addContributor,
  handleCloseModal,
}: CreateContributorModalContentProps) => {
  const [readMore, setReadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const toggleReadMore = () => setReadMore(!readMore);

  const handleSubmit = async (values: FormikValues) => {
    setIsLoading(true);
    const createAuthorityResponse = await createAuthority(values.firstName, values.lastName);
    if (isErrorStatus(createAuthorityResponse.status)) {
      dispatch(setNotification(t('feedback:error.create_authority'), NotificationVariant.Error));
    } else if (isSuccessStatus(createAuthorityResponse.status)) {
      addContributor(createAuthorityResponse.data);
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
              <StyledTypographyPreWrapped>
                {t('registration:contributors.create_new_author_description')}
              </StyledTypographyPreWrapped>
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
                  id={field.name}
                  fullWidth
                  label={t('first_name')}
                  required
                  disabled={isSubmitting}
                  variant="outlined"
                  error={!!error && touched}
                  data-testid="create-contributor-first-name"
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>
            <Field name="lastName">
              {({ field, meta: { error, touched } }: FieldProps) => (
                <TextField
                  {...field}
                  id={field.name}
                  fullWidth
                  label={t('last_name')}
                  required
                  disabled={isSubmitting}
                  variant="outlined"
                  error={!!error && touched}
                  data-testid="create-contributor-last-name"
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>
            <DialogActions>
              <Button onClick={handleCloseModal}>{t('common:close')}</Button>
              <ButtonWithProgress
                data-testid="button-create-authority"
                type="submit"
                color="secondary"
                variant="contained"
                isLoading={isLoading}
                disabled={isSubmitting}>
                {t('common:create')}
              </ButtonWithProgress>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </StyledBackgroundDiv>
  );
};

import { ErrorMessage, Field, FieldProps, Form, Formik, FormikValues } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button, Collapse, DialogActions, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { createAuthority } from '../../../../api/authorityApi';
import { StyledTypographyPreWrapped, StyledRightAlignedWrapper } from '../../../../components/styled/Wrappers';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { Authority } from '../../../../types/authority.types';
import { emptyNewContributor } from '../../../../types/contributor.types';
import { NotificationVariant } from '../../../../types/notification.types';
import { newContributorValidationSchema } from '../../../../utils/validation/newContributorValidation';
import { isErrorStatus, isSuccessStatus } from '../../../../utils/constants';

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
    <>
      <Formik
        initialValues={emptyNewContributor}
        validationSchema={newContributorValidationSchema}
        onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form noValidate>
            <Collapse in={readMore} collapsedSize="4.5rem">
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
                  sx={{ mb: '1rem' }}
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
              <LoadingButton
                data-testid="button-create-authority"
                type="submit"
                variant="contained"
                loading={isLoading}
                disabled={isSubmitting}>
                {t('common:create')}
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </>
  );
};

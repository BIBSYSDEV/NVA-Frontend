import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button, Collapse, DialogActions, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { InputContainerBox, StyledRightAlignedWrapper } from '../../../../components/styled/Wrappers';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { isErrorStatus, isSuccessStatus } from '../../../../utils/constants';
import { CristinUser } from '../../../../types/user.types';
import { authenticatedApiRequest } from '../../../../api/apiRequest';
import { CristinApiPath } from '../../../../api/apiPaths';
import { newUserValidationSchema } from '../../../../utils/validation/newContributorValidation';

interface SimpleUser {
  firstName: string;
  lastName: string;
}

const initialValuesUser: SimpleUser = {
  firstName: '',
  lastName: '',
};

interface CreateContributorModalContentProps {
  addContributor: (newContributor: CristinUser) => void;
  handleCloseModal: () => void;
}

export const CreateContributorModalContent = ({
  addContributor,
  handleCloseModal,
}: CreateContributorModalContentProps) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const [readMore, setReadMore] = useState(false);
  const toggleReadMore = () => setReadMore(!readMore);

  const handleSubmit = async (values: SimpleUser) => {
    const cristinUser: Partial<CristinUser> = {
      // TODO: Must have National Identification Number to be created
      names: [
        { type: 'FirstName', value: values.firstName },
        { type: 'LastName', value: values.lastName },
      ],
    };

    const createUserResponse = await authenticatedApiRequest<CristinUser>({
      url: CristinApiPath.Person,
      method: 'POST',
      data: cristinUser,
    });

    if (isErrorStatus(createUserResponse.status)) {
      dispatch(setNotification(t('feedback:error.created_cristin_user'), 'error'));
    } else if (isSuccessStatus(createUserResponse.status)) {
      dispatch(setNotification(t('feedback:success.created_cristin_user')));
      addContributor(createUserResponse.data);
      handleCloseModal();
    }
  };

  return (
    <>
      <Collapse in={readMore} collapsedSize="4.5rem">
        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
          {t('registration:contributors.create_new_author_description')}
        </Typography>
      </Collapse>
      <StyledRightAlignedWrapper>
        <Button data-testid="button-read-more" onClick={toggleReadMore}>
          {t(readMore ? 'read_less' : 'read_more')}
        </Button>
      </StyledRightAlignedWrapper>

      <Formik initialValues={initialValuesUser} validationSchema={newUserValidationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form noValidate>
            <InputContainerBox>
              <Field name="firstName">
                {({ field, meta: { error, touched } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    required
                    disabled={isSubmitting}
                    label={t('first_name')}
                    value={field.value ?? ''}
                    variant="filled"
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <Field name="lastName">
                {({ field, meta: { error, touched } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    required
                    disabled={isSubmitting}
                    label={t('last_name')}
                    value={field.value ?? ''}
                    variant="filled"
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
            </InputContainerBox>
            <DialogActions>
              <Button onClick={handleCloseModal}>{t('common:close')}</Button>
              <LoadingButton
                data-testid="button-create-authority"
                type="submit"
                variant="contained"
                loading={isSubmitting}
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

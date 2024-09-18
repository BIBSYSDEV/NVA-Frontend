import { LoadingButton } from '@mui/lab';
import { Box, Button, DialogActions, TextField, Typography } from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { useUpdateRegistrationStatus } from '../../../api/hooks/useUpdateRegistrationStatus';
import { Modal } from '../../../components/Modal';
import { RequiredDescription } from '../../../components/RequiredDescription';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { userCanUnpublishRegistration } from '../../../utils/registration-helpers';
import { FindRegistration } from './FindRegistration';

interface UnpublishRegistrationProps {
  registration: Registration;
}

export const UnpublishRegistration = ({ registration }: UnpublishRegistrationProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const toggleUnpublishModal = () => setShowUnpublishModal(!showUnpublishModal);

  const [selectedDuplicate, setSelectedDuplicate] = useState<Registration>();

  const userCanUnpublish = userCanUnpublishRegistration(registration);

  const unpublishValidationSchema = Yup.object().shape({
    comment: Yup.string()
      .min(3, t('feedback.validation.must_be_bigger_than', { field: t('common.justification'), limit: 3 }))
      .required(t('feedback.validation.is_required', { field: t('common.justification') })),
  });

  const updateRegistrationStatusMutation = useUpdateRegistrationStatus();

  return (
    <section>
      <Typography fontWeight="bold">{t('unpublish_actions.unpublish_header')}</Typography>
      {userCanUnpublish ? (
        <>
          <Typography gutterBottom>{t('unpublish_actions.unpublish_info')}</Typography>
          <Button
            data-testid={dataTestId.unpublishActions.openUnpublishModalButton}
            variant="outlined"
            fullWidth
            size="small"
            sx={{ bgcolor: 'white' }}
            onClick={toggleUnpublishModal}>
            {t('unpublish_actions.unpublish')}
          </Button>
        </>
      ) : (
        <Trans
          t={t}
          i18nKey="unpublish_actions.unpublish_not_allowed"
          components={[<Typography gutterBottom key="1" />]}
        />
      )}

      <Modal
        headingText={t('registration.delete_registration')}
        open={showUnpublishModal}
        onClose={toggleUnpublishModal}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <RequiredDescription />
          <Typography>{t('unpublish_actions.unpublish_registration_detail_1')}</Typography>
          <Typography>{t('unpublish_actions.unpublish_registration_detail_2')}</Typography>

          <Formik
            initialValues={{ comment: '' }}
            validationSchema={unpublishValidationSchema}
            onSubmit={(values) =>
              updateRegistrationStatusMutation.mutate({
                registrationIdentifier: registration.identifier,
                data: {
                  type: 'UnpublishPublicationRequest',
                  duplicateOf: selectedDuplicate?.id,
                  comment: values.comment,
                },
                onSuccess: () => {
                  toggleUnpublishModal();
                  history.push({ search: '?shouldNotRedirect' });
                },
              })
            }>
            <Form noValidate>
              <Box sx={{ my: '1rem' }}>
                <Typography gutterBottom>{t('unpublish_actions.unpublish_registration_reason')}</Typography>
                <Field name="comment">
                  {({ field, meta: { touched, error } }: FieldProps<string>) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      required
                      data-testid={dataTestId.unpublishActions.unpublishJustificationTextField}
                      variant="filled"
                      fullWidth
                      label={t('common.justification')}
                      error={touched && !!error}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                </Field>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', my: '1rem' }}>
                <Typography variant="h3">{t('unpublish_actions.unpublish_registration_duplicate_question')}</Typography>
                <Typography>{t('unpublish_actions.unpublish_registration_duplicate_citation_information')}</Typography>
              </Box>
              <FindRegistration
                setSelectedRegistration={setSelectedDuplicate}
                selectedRegistration={selectedDuplicate}
                filteredRegistrationIdentifier={registration.identifier}
              />
              <DialogActions>
                <Button data-testid={dataTestId.confirmDialog.cancelButton} onClick={toggleUnpublishModal}>
                  {t('common.cancel')}
                </Button>
                <LoadingButton
                  loading={updateRegistrationStatusMutation.isPending}
                  type="submit"
                  data-testid={dataTestId.confirmDialog.acceptButton}
                  variant="outlined">
                  {t('unpublish_actions.unpublish')}
                </LoadingButton>
              </DialogActions>
            </Form>
          </Formik>
        </Box>
      </Modal>
    </section>
  );
};

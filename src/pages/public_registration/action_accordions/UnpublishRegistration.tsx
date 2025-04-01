import { Box, Button, Checkbox, DialogActions, FormControlLabel, TextField, Typography } from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import { useUpdateRegistrationStatus } from '../../../api/hooks/useUpdateRegistrationStatus';
import { Modal } from '../../../components/Modal';
import { RequiredDescription } from '../../../components/RequiredDescription';
import { Registration, RegistrationSearchItem } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { userHasAccessRight } from '../../../utils/registration-helpers';
import { doNotRedirectQueryParam } from '../../../utils/urlPaths';
import { FindRegistration } from './FindRegistration';

interface UnpublishRegistrationProps {
  registration: Registration;
}

export const UnpublishRegistration = ({ registration }: UnpublishRegistrationProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const toggleUnpublishModal = () => setShowUnpublishModal(!showUnpublishModal);

  const [selectedDuplicate, setSelectedDuplicate] = useState<RegistrationSearchItem>();

  const userCanUnpublish = userHasAccessRight(registration, 'unpublish');

  const [confirmedUnpublish, setConfirmedUnpublish] = useState(false);

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
                updateStatusRequest: {
                  type: 'UnpublishPublicationRequest',
                  duplicateOf: selectedDuplicate?.id,
                  comment: values.comment,
                },
                onSuccess: () => {
                  toggleUnpublishModal();
                  navigate({ search: `?${doNotRedirectQueryParam}=true` });
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
                      multiline
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
              <FormControlLabel
                sx={{ my: '1rem' }}
                control={
                  <Checkbox
                    data-testid={dataTestId.unpublishActions.confirmUnpublishCheckbox}
                    onChange={() => setConfirmedUnpublish(!confirmedUnpublish)}
                  />
                }
                label={t('unpublish_actions.confirm_unpublish')}
              />
              <DialogActions>
                <Button data-testid={dataTestId.confirmDialog.cancelButton} onClick={toggleUnpublishModal}>
                  {t('common.cancel')}
                </Button>
                <Button
                  loading={updateRegistrationStatusMutation.isPending}
                  disabled={!confirmedUnpublish}
                  type="submit"
                  data-testid={dataTestId.confirmDialog.acceptButton}
                  variant="outlined">
                  {t('unpublish_actions.unpublish')}
                </Button>
              </DialogActions>
            </Form>
          </Formik>
        </Box>
      </Modal>
    </section>
  );
};

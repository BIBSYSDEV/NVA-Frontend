import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useUpdateRegistrationStatus } from '../../../api/hooks/useUpdateRegistrationStatus';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { userHasAccessRight } from '../../../utils/registration-helpers';

interface TerminateRegistrationProps {
  registration: Registration;
}

export const TerminateRegistration = ({ registration }: TerminateRegistrationProps) => {
  const { t } = useTranslation();
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const toggleTerminateModal = () => setShowTerminateModal(!showTerminateModal);

  const userCanTerminate = userHasAccessRight(registration, 'terminate');

  const updateRegistrationStatusMutation = useUpdateRegistrationStatus();

  if (!userCanTerminate) {
    return null;
  }

  return (
    <section>
      <Typography fontWeight="bold">{t('common.delete')}</Typography>
      <Trans
        i18nKey="registration.public_page.tasks_panel.terminate_result_description"
        components={[<Typography gutterBottom key="1" />]}
      />
      <Button
        data-testid={dataTestId.registrationLandingPage.tasksPanel.terminateRegistrationButton}
        variant="outlined"
        fullWidth
        size="small"
        sx={{ bgcolor: 'white' }}
        onClick={toggleTerminateModal}>
        {t('common.delete')}
      </Button>

      <ConfirmDialog
        open={showTerminateModal}
        title={t('registration.public_page.tasks_panel.terminate_result')}
        onAccept={async () => {
          await updateRegistrationStatusMutation.mutateAsync({
            registrationIdentifier: registration.identifier,
            updateStatusRequest: { type: 'DeletePublicationRequest' },
          });
          toggleTerminateModal();
        }}
        isLoading={updateRegistrationStatusMutation.isPending}
        confirmButtonLabel={t('common.delete')}
        cancelButtonLabel={t('common.cancel')}
        onCancel={toggleTerminateModal}>
        <Trans
          i18nKey="registration.public_page.tasks_panel.terminate_result_confirmation"
          components={[<Typography key="1" gutterBottom />]}
        />
      </ConfirmDialog>
    </section>
  );
};

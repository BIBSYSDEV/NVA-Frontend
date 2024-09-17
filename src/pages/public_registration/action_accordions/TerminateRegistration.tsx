import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useUpdateRegistrationStatus } from '../../../api/hooks/useUpdateRegistrationStatus';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { userCanTerminateRegistration } from '../../../utils/registration-helpers';

interface TerminateRegistrationProps {
  registration: Registration;
}

export const TerminateRegistration = ({ registration }: TerminateRegistrationProps) => {
  const { t } = useTranslation();
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const userCanTerminate = userCanTerminateRegistration(registration);

  const updateRegistrationStatusMutation = useUpdateRegistrationStatus();

  if (!userCanTerminate) {
    return null;
  }

  return (
    <>
      <Typography fontWeight="bold">{t('common.delete')}</Typography>
      <Trans
        i18nKey="registration.public_page.tasks_panel.terminate_result_description"
        components={[<Typography key="1" />]}
      />
      <Button
        data-testid={dataTestId.registrationLandingPage.tasksPanel.terminateRegistrationButton}
        variant="outlined"
        sx={{ bgcolor: 'white' }}
        onClick={() => setShowTerminateModal(true)}>
        {t('common.delete')}
      </Button>

      <ConfirmDialog
        open={showTerminateModal}
        title={t('registration.public_page.tasks_panel.terminate_result')}
        onAccept={() =>
          updateRegistrationStatusMutation.mutate({
            registrationIdentifier: registration.identifier,
            data: { type: 'DeletePublicationRequest' },
            onSuccess: () => setShowTerminateModal(false),
          })
        }
        isLoading={updateRegistrationStatusMutation.isPending}
        confirmButtonLabel={t('common.delete')}
        cancelButtonLabel={t('common.cancel')}
        onCancel={() => setShowTerminateModal(false)}>
        <Trans
          i18nKey="registration.public_page.tasks_panel.terminate_result_confirmation"
          components={[<Typography key="1" gutterBottom />]}
        />
      </ConfirmDialog>
    </>
  );
};

import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
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

  // const unpublishRegistrationMutation = useMutation({
  //   mutationFn: (values: UnpublishForm) => {
  //     if (selectedDuplicate) {
  //       return unpublishRegistration(registration.identifier, {
  //         type: 'UnpublishPublicationRequest',
  //         duplicateOf: selectedDuplicate.id,
  //         comment: values.deleteMessage,
  //       });
  //     } else {
  //       return unpublishRegistration(registration.identifier, {
  //         type: 'UnpublishPublicationRequest',
  //         comment: values.deleteMessage,
  //       });
  //     }
  //   },
  //   onSuccess: () => {
  //     setShowDeleteModal(false);
  //     history.push(`${getRegistrationLandingPagePath(registration.identifier)}?shouldNotRedirect`);
  //   },
  //   onError: () => {
  //     dispatch(setNotification({ message: t('feedback.error.update_registration'), variant: 'error' }));
  //   },
  // });

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
    </>
  );
};

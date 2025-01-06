import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { deleteRegistration } from '../../../api/registrationApi';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { setNotification } from '../../../redux/notificationSlice';
import { PreviousPathLocationState, PreviousSearchLocationState } from '../../../types/locationState.types';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getTitleString } from '../../../utils/registration-helpers';
import { UrlPathTemplate } from '../../../utils/urlPaths';

interface DeleteDraftRegistrationProps {
  registration: Registration;
}

export const DeleteDraftRegistration = ({ registration }: DeleteDraftRegistrationProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory<(PreviousSearchLocationState & PreviousPathLocationState) | undefined>();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const draftRegistrationMutation = useMutation({
    mutationFn: () => deleteRegistration(registration.identifier),
    onSuccess: () => {
      dispatch(setNotification({ message: t('feedback.success.delete_registration'), variant: 'success' }));

      if (history.location.pathname.startsWith(UrlPathTemplate.MyPageMessages)) {
        history.push({
          pathname: UrlPathTemplate.MyPageMyMessages,
          search: history.location.state?.previousSearch,
        });
      } else if (history.location.pathname.startsWith(UrlPathTemplate.RegistrationNew)) {
        history.push(history.location.state?.previousPath || UrlPathTemplate.MyPageMyRegistrations);
      } else if (history.location.pathname.startsWith(UrlPathTemplate.TasksDialogue)) {
        history.push({
          pathname: UrlPathTemplate.TasksDialogue,
          search: history.location.state?.previousSearch,
        });
      }
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.delete_registration'), variant: 'error' })),
  });

  return (
    <section>
      <Typography fontWeight="bold">{t('common.delete')}</Typography>
      <Trans i18nKey="registration.public_page.tasks_panel.delete_draft_registration_description">
        <Typography gutterBottom />
      </Trans>

      <Button
        data-testid={dataTestId.registrationLandingPage.tasksPanel.deleteRegistrationButton}
        sx={{ bgcolor: 'white' }}
        size="small"
        fullWidth
        startIcon={<DeleteIcon />}
        variant="outlined"
        onClick={() => setShowDeleteModal(true)}>
        {t('common.delete')}
      </Button>

      <ConfirmDialog
        open={showDeleteModal}
        title={t('my_page.registrations.delete_registration')}
        onAccept={draftRegistrationMutation.mutate}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={draftRegistrationMutation.isPending}>
        <Typography>
          {t('my_page.registrations.delete_registration_message', {
            title: getTitleString(registration?.entityDescription?.mainTitle),
          })}
        </Typography>
      </ConfirmDialog>
    </section>
  );
};

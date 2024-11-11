import { Box, Button, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { addTicketMessage, deleteRegistration } from '../../api/registrationApi';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { setNotification } from '../../redux/notificationSlice';
import { RootState } from '../../redux/store';
import { PublishingTicket, Ticket } from '../../types/publication_types/ticket.types';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { getTitleString } from '../../utils/registration-helpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import { DoiRequestAccordion } from './action_accordions/DoiRequestAccordion';
import { PublishingAccordion } from './action_accordions/PublishingAccordion';
import { SupportAccordion } from './action_accordions/SupportAccordion';

interface ActionPanelContentProps extends PublicRegistrationContentProps {
  refetchData: () => Promise<void>;
  isLoadingData?: boolean;
  shouldSeePublishingAccordion: boolean;
  shouldSeeDoiAccordion: boolean;
  shouldSeeSupportAccordion: boolean;
  shouldSeeDelete: boolean;
  publishingRequestTickets: PublishingTicket[];
  newestDoiRequestTicket?: Ticket;
  newestSupportTicket?: Ticket;
}

export const ActionPanelContent = ({
  registration,
  refetchData,
  isLoadingData = false,
  shouldSeePublishingAccordion,
  shouldSeeDoiAccordion,
  shouldSeeSupportAccordion,
  shouldSeeDelete,
  publishingRequestTickets,
  newestDoiRequestTicket,
  newestSupportTicket,
}: ActionPanelContentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const currentPath = history.location.pathname;
  const customer = useSelector((store: RootState) => store.customer);

  const addMessage = async (ticketId: string, message: string) => {
    const addMessageResponse = await addTicketMessage(ticketId, message);
    if (isErrorStatus(addMessageResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.send_message'), variant: 'error' }));
    } else if (isSuccessStatus(addMessageResponse.status)) {
      await refetchData();
      dispatch(setNotification({ message: t('feedback.success.send_message'), variant: 'success' }));
      return true;
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const draftRegistrationMutation = useMutation({
    mutationFn: () => deleteRegistration(registration.identifier),
    onSuccess: () => {
      dispatch(
        setNotification({
          message: t('feedback.success.delete_registration'),
          variant: 'success',
        })
      );

      if (currentPath.startsWith(UrlPathTemplate.MyPageMessages)) {
        history.push(UrlPathTemplate.MyPageMyMessages);
      } else if (currentPath.startsWith(UrlPathTemplate.RegistrationNew)) {
        history.push(UrlPathTemplate.MyPageMyRegistrations);
      }
    },
    onError: () => {
      dispatch(
        setNotification({
          message: t('feedback.error.delete_registration'),
          variant: 'error',
        })
      );
    },
  });

  return (
    <>
      {shouldSeePublishingAccordion && (
        <ErrorBoundary>
          <PublishingAccordion
            refetchData={refetchData}
            isLoadingData={isLoadingData}
            registration={registration}
            publishingRequestTickets={publishingRequestTickets}
            addMessage={addMessage}
          />
        </ErrorBoundary>
      )}

      {shouldSeeDoiAccordion && (
        <ErrorBoundary>
          {!registration.entityDescription?.reference?.doi && customer?.doiAgent.username && (
            <DoiRequestAccordion
              refetchData={refetchData}
              isLoadingData={isLoadingData}
              registration={registration}
              doiRequestTicket={newestDoiRequestTicket}
              addMessage={addMessage}
            />
          )}
        </ErrorBoundary>
      )}

      {shouldSeeSupportAccordion && (
        <ErrorBoundary>
          <SupportAccordion
            registration={registration}
            supportTicket={newestSupportTicket}
            addMessage={addMessage}
            refetchData={refetchData}
          />
        </ErrorBoundary>
      )}

      {shouldSeeDelete && (
        <Box sx={{ m: '0.5rem', mt: '1rem' }}>
          <Button
            sx={{ bgcolor: 'white' }}
            size="small"
            fullWidth
            variant="outlined"
            onClick={() => setShowDeleteModal(true)}>
            {t('common.delete')}
          </Button>

          <ConfirmDialog
            open={!!showDeleteModal}
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
        </Box>
      )}
    </>
  );
};

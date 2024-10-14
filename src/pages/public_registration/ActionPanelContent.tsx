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
import { RegistrationStatus } from '../../types/registration.types';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { getTitleString, userHasAccessRight } from '../../utils/registration-helpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import { DoiRequestAccordion } from './action_accordions/DoiRequestAccordion';
import { PublishingAccordion } from './action_accordions/PublishingAccordion';
import { SupportAccordion } from './action_accordions/SupportAccordion';

interface ActionPanelContentProps extends PublicRegistrationContentProps {
  tickets: Ticket[];
  refetchData: () => Promise<void>;
  isLoadingData?: boolean;
}

export const ActionPanelContent = ({
  registration,
  tickets,
  refetchData,
  isLoadingData = false,
}: ActionPanelContentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const currentPath = history.location.pathname;
  const customer = useSelector((store: RootState) => store.customer);

  const publishingRequestTickets = tickets.filter(
    (ticket) => ticket.type === 'PublishingRequest'
  ) as PublishingTicket[];
  const newestDoiRequestTicket = tickets.findLast((ticket) => ticket.type === 'DoiRequest');
  const newestSupportTicket = tickets.findLast((ticket) => ticket.type === 'GeneralSupportCase');

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

  const isPublishedOrDraft =
    registration.status === RegistrationStatus.Published ||
    registration.status === RegistrationStatus.Draft ||
    registration.status === RegistrationStatus.PublishedMetadata;

  const isNotOnTasksDialoguePage = !window.location.pathname.startsWith(UrlPathTemplate.TasksDialogue);

  const canCreatePublishingTicket =
    isNotOnTasksDialoguePage && userHasAccessRight(registration, 'publishing-request-create');
  const canApprovePublishingTicket =
    publishingRequestTickets.length > 0 && userHasAccessRight(registration, 'publishing-request-approve');
  const hasOtherPublishingRights =
    userHasAccessRight(registration, 'unpublish') ||
    userHasAccessRight(registration, 'republish') ||
    userHasAccessRight(registration, 'terminate');

  const canCreateDoiTicket =
    isPublishedOrDraft && isNotOnTasksDialoguePage && userHasAccessRight(registration, 'doi-request-create');
  const canApproveDoiTicket =
    !!newestDoiRequestTicket && isPublishedOrDraft && userHasAccessRight(registration, 'doi-request-approve');

  const canCreateSupportTicket = isNotOnTasksDialoguePage && userHasAccessRight(registration, 'support-request-create');
  const canApproveSupportTicket = !!newestSupportTicket && userHasAccessRight(registration, 'support-request-approve');

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
      {(canCreatePublishingTicket || canApprovePublishingTicket || hasOtherPublishingRights) && (
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

      {(canCreateDoiTicket || canApproveDoiTicket) && (
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

      {(canCreateSupportTicket || canApproveSupportTicket) && (
        <ErrorBoundary>
          <SupportAccordion
            registration={registration}
            supportTicket={newestSupportTicket}
            addMessage={addMessage}
            refetchData={refetchData}
          />
        </ErrorBoundary>
      )}

      {userHasAccessRight(registration, 'delete') && (
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

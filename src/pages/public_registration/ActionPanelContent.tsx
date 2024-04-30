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
import {
  getTitleString,
  userCanDeleteRegistration,
  userHasSameCustomerAsRegistration,
} from '../../utils/registration-helpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import { DoiRequestAccordion } from './action_accordions/DoiRequestAccordion';
import { PublishingAccordion } from './action_accordions/PublishingAccordion';
import { SupportAccordion } from './action_accordions/SupportAccordion';

interface ActionPanelContentProps extends PublicRegistrationContentProps {
  tickets: Ticket[];
  refetchData: () => void;
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
  const user = useSelector((store: RootState) => store.user);
  const customer = useSelector((store: RootState) => store.customer);

  const canBeCuratorForThisCustomer = userHasSameCustomerAsRegistration(user, registration);

  const doiRequestTicket = tickets.find((ticket) => ticket.type === 'DoiRequest') ?? null;
  const publishingRequestTickets = tickets.filter(
    (ticket) => ticket.type === 'PublishingRequest'
  ) as PublishingTicket[];
  const supportTickets = tickets.filter((ticket) => ticket.type === 'GeneralSupportCase');
  const currentSupportTicket = supportTickets.pop() ?? null;

  const addMessage = async (ticketId: string, message: string) => {
    const addMessageResponse = await addTicketMessage(ticketId, message);
    if (isErrorStatus(addMessageResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.send_message'), variant: 'error' }));
    } else if (isSuccessStatus(addMessageResponse.status)) {
      dispatch(setNotification({ message: t('feedback.success.send_message'), variant: 'success' }));
      refetchData();
      return true;
    }
  };

  const canCreateTickets = !window.location.pathname.startsWith(UrlPathTemplate.TasksDialogue);

  const isInRegistrationWizard =
    window.location.pathname.startsWith(UrlPathTemplate.RegistrationNew) && window.location.pathname.endsWith('/edit');
  const canDeleteRegistration = userCanDeleteRegistration(registration) && isInRegistrationWizard;

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
      {!isInRegistrationWizard && (
        <>
          {(canCreateTickets || publishingRequestTickets.length > 0) && (
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
          {(canCreateTickets || doiRequestTicket) && (
            <ErrorBoundary>
              {!registration.entityDescription?.reference?.doi && customer?.doiAgent.username && (
                <DoiRequestAccordion
                  refetchData={refetchData}
                  isLoadingData={isLoadingData}
                  registration={registration}
                  doiRequestTicket={doiRequestTicket}
                  userIsCurator={!!user?.isDoiCurator && canBeCuratorForThisCustomer}
                  addMessage={addMessage}
                />
              )}
            </ErrorBoundary>
          )}
        </>
      )}

      {(canCreateTickets || currentSupportTicket || isInRegistrationWizard) && (
        <ErrorBoundary>
          <SupportAccordion
            userIsCurator={!!user?.isSupportCurator && canBeCuratorForThisCustomer}
            registration={registration}
            supportTicket={currentSupportTicket}
            addMessage={addMessage}
            refetchData={refetchData}
            isRegistrationWizard={isInRegistrationWizard}
          />
        </ErrorBoundary>
      )}

      {canDeleteRegistration && (
        <Box sx={{ m: '0.5rem', mt: '1rem' }}>
          <Button sx={{ bgcolor: 'white' }} fullWidth variant="outlined" onClick={() => setShowDeleteModal(true)}>
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

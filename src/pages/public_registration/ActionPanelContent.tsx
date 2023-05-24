import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { addTicketMessage } from '../../api/registrationApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { setNotification } from '../../redux/notificationSlice';
import { RootState } from '../../redux/store';
import { PublishingTicket, Ticket } from '../../types/publication_types/ticket.types';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { userIsCuratorForRegistration } from '../../utils/registration-helpers';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import { DoiRequestAccordion } from './action_accordions/DoiRequestAccordion';
import { PublishingAccordion } from './action_accordions/PublishingAccordion';
import { SupportAccordion } from './action_accordions/SupportAccordion';

interface ActionPanelContentProps extends PublicRegistrationContentProps {
  tickets: Ticket[];
  refetchData: () => void;
  isLoadingData?: boolean;
  canCreateTickets: boolean;
}

export const ActionPanelContent = ({
  registration,
  tickets,
  refetchData,
  isLoadingData = false,
  canCreateTickets = true,
}: ActionPanelContentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user, customer } = useSelector((store: RootState) => store);
  const userIsCurator = userIsCuratorForRegistration(user, registration);

  const doiRequestTicket = tickets.find((ticket) => ticket.type === 'DoiRequest') ?? null;
  const publishingRequestTickets = tickets.filter((ticket) => ticket.type === 'PublishingRequest');
  const currentPublishingRequestTicket = (publishingRequestTickets.pop() as PublishingTicket | undefined) ?? null;
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

  return (
    <>
      {(canCreateTickets || publishingRequestTickets) && (
        <ErrorBoundary>
          <PublishingAccordion
            refetchData={refetchData}
            isLoadingData={isLoadingData}
            registration={registration}
            publishingRequestTicket={currentPublishingRequestTicket}
            userIsCurator={userIsCurator}
            addMessage={addMessage}
          />
        </ErrorBoundary>
      )}
      {(canCreateTickets || doiRequestTicket) && (
        <ErrorBoundary>
          {!registration.entityDescription?.reference?.doi &&
            doiRequestTicket?.status !== 'Completed' &&
            customer?.doiAgent.username && (
              <DoiRequestAccordion
                refetchData={refetchData}
                isLoadingData={isLoadingData}
                registration={registration}
                doiRequestTicket={doiRequestTicket}
                userIsCurator={userIsCurator}
                addMessage={addMessage}
              />
            )}
        </ErrorBoundary>
      )}

      <ErrorBoundary>
        <SupportAccordion
          registration={registration}
          supportTicket={currentSupportTicket}
          addMessage={addMessage}
          refetchData={refetchData}
        />
      </ErrorBoundary>
    </>
  );
};

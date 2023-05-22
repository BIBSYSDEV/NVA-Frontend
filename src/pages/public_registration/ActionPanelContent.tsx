import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { addTicketMessage } from '../../api/registrationApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { BackgroundDiv } from '../../components/styled/Wrappers';
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
  refetchRegistrationAndTickets: () => void;
  isLoadingData: boolean;
}

export const ActionPanelContent = ({
  registration,
  tickets,
  refetchRegistrationAndTickets,
  isLoadingData,
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
      refetchRegistrationAndTickets();
      return true;
    }
  };

  return (
    <BackgroundDiv>
      <ErrorBoundary>
        <PublishingAccordion
          refetchRegistrationAndTickets={refetchRegistrationAndTickets}
          isLoadingData={isLoadingData}
          registration={registration}
          publishingRequestTicket={currentPublishingRequestTicket}
          userIsCurator={userIsCurator}
          addMessage={addMessage}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        {!registration.entityDescription?.reference?.doi &&
          doiRequestTicket?.status !== 'Completed' &&
          customer?.doiAgent.username && (
            <DoiRequestAccordion
              refetchRegistrationAndTickets={refetchRegistrationAndTickets}
              isLoadingData={isLoadingData}
              registration={registration}
              doiRequestTicket={doiRequestTicket}
              userIsCurator={userIsCurator}
              addMessage={addMessage}
            />
          )}
      </ErrorBoundary>
      <ErrorBoundary>
        <SupportAccordion registration={registration} supportTicket={currentSupportTicket} addMessage={addMessage} />
      </ErrorBoundary>
    </BackgroundDiv>
  );
};

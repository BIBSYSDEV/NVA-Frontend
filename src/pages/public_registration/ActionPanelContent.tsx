import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { addTicketMessage } from '../../api/registrationApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { setNotification } from '../../redux/notificationSlice';
import { RootState } from '../../redux/store';
import { PublishingTicket, Ticket } from '../../types/publication_types/ticket.types';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
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
  publishingRequestTickets,
  newestDoiRequestTicket,
  newestSupportTicket,
}: ActionPanelContentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
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
    </>
  );
};

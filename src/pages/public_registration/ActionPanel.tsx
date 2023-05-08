import { Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { StyledPaperHeader } from '../../components/PageWithSideMenu';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import { Ticket } from '../../types/publication_types/messages.types';
import { dataTestId } from '../../utils/dataTestIds';
import { userIsCuratorForRegistration } from '../../utils/registration-helpers';
import { DoiRequestAccordion } from './action_accordions/DoiRequestAccordion';
import { PublishingAccordion } from './action_accordions/PublishingAccordion';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import { addTicketMessage } from '../../api/registrationApi';
import { setNotification } from '../../redux/notificationSlice';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';

interface ActionPanelProps extends PublicRegistrationContentProps {
  tickets: Ticket[];
  refetchRegistrationAndTickets: () => void;
  isLoadingData: boolean;
}

export const ActionPanel = ({
  registration,
  tickets,
  refetchRegistrationAndTickets,
  isLoadingData,
}: ActionPanelProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user, customer } = useSelector((store: RootState) => store);
  const userIsCurator = userIsCuratorForRegistration(user, registration);

  const doiRequestTicket = tickets.find((ticket) => ticket.type === 'DoiRequest') ?? null;
  const publishingRequestTickets = tickets.filter((ticket) => ticket.type === 'PublishingRequest');
  const currentPublishingRequestTicket = publishingRequestTickets.pop() ?? null;

  const addMessage = async (ticketId: string, message: string) => {
    const addMessageResponse = await addTicketMessage(ticketId, message);
    if (isErrorStatus(addMessageResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.send_message'), variant: 'error' }));
    } else if (isSuccessStatus(addMessageResponse.status)) {
      dispatch(setNotification({ message: t('feedback.success.send_message'), variant: 'success' }));
      // const newMessage: Message = {
      //   ...messagesCopy[0],
      //   createdDate: new Date().toString(),
      //   sender: username ?? '',
      //   text: message,
      // };
      // setMessagesCopy([...messagesCopy, newMessage]);
      refetchRegistrationAndTickets();
    }
  };

  return (
    <Paper elevation={0} data-testid={dataTestId.registrationLandingPage.tasksPanel.panelRoot}>
      <StyledPaperHeader>
        <Typography color="inherit" variant="h1">
          {t('common.tasks')}
        </Typography>
      </StyledPaperHeader>
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
              />
            )}
        </ErrorBoundary>
      </BackgroundDiv>
    </Paper>
  );
};

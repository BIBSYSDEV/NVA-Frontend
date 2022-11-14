import { CircularProgress, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { StyledPaperHeader } from '../../components/PageWithSideMenu';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import { TicketCollection } from '../../types/publication_types/messages.types';
import { dataTestId } from '../../utils/dataTestIds';
import { useFetch } from '../../utils/hooks/useFetch';
import {
  associatedArtifactIsLink,
  userCanEditRegistration,
  userIsCuratorForRegistration,
} from '../../utils/registration-helpers';
import { DoiRequestAccordion } from './action_accordions/DoiRequestAccordion';
import { PublishingAccordion } from './action_accordions/PublishingAccordion';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';

export interface ActionPanelProps extends PublicRegistrationContentProps {
  refetchRegistration: () => void;
}

export const ActionPanel = ({ registration, refetchRegistration }: ActionPanelProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const userIsCurator = userIsCuratorForRegistration(user, registration);

  const [registrationTicketCollection, isLoadingRegistrationTicketCollection] = useFetch<TicketCollection>({
    url: userCanEditRegistration(user, registration) ? `${registration.id}/tickets` : '',
    withAuthentication: true,
    errorMessage: t('feedback.error.get_tickets'),
  });
  const registrationTickets = registrationTicketCollection?.tickets ?? [];
  const doiRequestTicket = registrationTickets.find((ticket) => ticket.type === 'DoiRequest') ?? null;
  const publishingRequestTicket = registrationTickets.find((ticket) => ticket.type === 'PublishingRequest') ?? null;

  return (
    <Paper elevation={0} data-testid={dataTestId.registrationLandingPage.tasksPanel.panelRoot}>
      <StyledPaperHeader>
        <Typography color="inherit" variant="h2" component="h1" id="tasks-header">
          {t('common.tasks')}
        </Typography>
      </StyledPaperHeader>
      <BackgroundDiv>
        {isLoadingRegistrationTicketCollection ? (
          <CircularProgress aria-labelledby="tasks-header" />
        ) : (
          <>
            <ErrorBoundary>
              <PublishingAccordion
                refetchRegistration={refetchRegistration}
                registration={registration}
                publishingRequestTicket={publishingRequestTicket}
                userIsCurator={userIsCurator}
              />
            </ErrorBoundary>
            <ErrorBoundary>
              {!registration.entityDescription?.reference?.doi &&
                !registration.associatedArtifacts.some(associatedArtifactIsLink) &&
                doiRequestTicket?.status !== 'Completed' && (
                  <DoiRequestAccordion
                    refetchRegistration={refetchRegistration}
                    registration={registration}
                    doiRequestTicket={doiRequestTicket}
                    userIsCurator={userIsCurator}
                  />
                )}
            </ErrorBoundary>
          </>
        )}
      </BackgroundDiv>
    </Paper>
  );
};

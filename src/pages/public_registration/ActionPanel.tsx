import { Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { StyledPaperHeader } from '../../components/PageWithSideMenu';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import { dataTestId } from '../../utils/dataTestIds';
import { associatedArtifactIsLink, userIsCuratorForRegistration } from '../../utils/registration-helpers';
import { DoiRequestAccordion } from './action_accordions/DoiRequestAccordion';
import { PublishingAccordion } from './action_accordions/PublishingAccordion';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';

export interface ActionPanelProps extends PublicRegistrationContentProps {
  refetchRegistration: () => void;
}

export const ActionPanel = ({ registration, refetchRegistration, tickets }: ActionPanelProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const userIsCurator = userIsCuratorForRegistration(user, registration);

  const doiRequestTicket = tickets.find((ticket) => ticket.type === 'DoiRequest') ?? null;
  const publishingRequestTicket = tickets.find((ticket) => ticket.type === 'PublishingRequest') ?? null;

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
      </BackgroundDiv>
    </Paper>
  );
};

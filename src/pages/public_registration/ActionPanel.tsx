import { Paper, Tab, Tabs } from '@mui/material';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { RootState } from '../../redux/store';
import { PublishingTicket, Ticket } from '../../types/publication_types/ticket.types';
import { RegistrationStatus } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { userHasAccessRight } from '../../utils/registration-helpers';
import { isFileApprovalTicket } from '../../utils/ticketHelpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { ActionPanelContent } from './ActionPanelContent';
import { DetailsPanel } from './log/DetailsPanel';
import { LogPanel } from './log/LogPanel';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';

enum TabValue {
  Tasks,
  Details,
  Log,
}

interface ActionPanelProps extends PublicRegistrationContentProps {
  tickets: Ticket[];
  refetchRegistrationAndTickets: () => Promise<void>;
  isLoadingData: boolean;
}

export const ActionPanel = ({
  registration,
  tickets,
  refetchRegistrationAndTickets,
  isLoadingData,
}: ActionPanelProps) => {
  const { t } = useTranslation();
  const customer = useSelector((store: RootState) => store.customer);
  const contributors = registration.entityDescription?.contributors ?? [];
  const user = useSelector((store: RootState) => store.user);

  const publishingRequestTickets = tickets.filter(isFileApprovalTicket) as PublishingTicket[];
  const newestDoiRequestTicket = tickets.findLast((ticket) => ticket.type === 'DoiRequest');
  const newestSupportTicket = tickets.findLast((ticket) => ticket.type === 'GeneralSupportCase');

  const isPublishedOrDraft =
    registration.status === RegistrationStatus.Published ||
    registration.status === RegistrationStatus.Draft ||
    registration.status === RegistrationStatus.PublishedMetadata;

  const isNotOnTasksDialoguePage = !window.location.pathname.startsWith(UrlPathTemplate.TasksDialogue);

  const canCreatePublishingTicket = userHasAccessRight(registration, 'publishing-request-create');
  const canHandlePublishingTicket = publishingRequestTickets.some((ticket) => ticket.allowedOperations.length > 0);
  const hasOtherPublishingRights =
    userHasAccessRight(registration, 'unpublish') ||
    userHasAccessRight(registration, 'republish') ||
    userHasAccessRight(registration, 'terminate') ||
    userHasAccessRight(registration, 'delete');

  const customerHasConfiguredDoi = customer?.doiAgent.username;
  const canCreateDoiTicket =
    isPublishedOrDraft && isNotOnTasksDialoguePage && userHasAccessRight(registration, 'doi-request-create');
  const canApproveDoiTicket =
    !!newestDoiRequestTicket && isPublishedOrDraft && userHasAccessRight(registration, 'doi-request-approve');

  const canCreateSupportTicket = isNotOnTasksDialoguePage && userHasAccessRight(registration, 'support-request-create');
  const canApproveSupportTicket = !!newestSupportTicket && userHasAccessRight(registration, 'support-request-approve');

  const shouldSeePublishingAccordion =
    !!user &&
    (canCreatePublishingTicket || canHandlePublishingTicket || hasOtherPublishingRights || !!publishingRequestTickets);

  const shouldSeeDoiAccordion =
    !!user &&
    !registration.entityDescription?.reference?.doi &&
    !!customerHasConfiguredDoi &&
    (canCreateDoiTicket || canApproveDoiTicket || !!newestDoiRequestTicket);

  const shouldSeeSupportAccordion =
    !!user && (canCreateSupportTicket || canApproveSupportTicket || !!newestSupportTicket);

  const canSeeTasksPanel = shouldSeePublishingAccordion || shouldSeeDoiAccordion || shouldSeeSupportAccordion;

  const [tabValue, setTabValue] = useState(canSeeTasksPanel ? TabValue.Tasks : TabValue.Details);

  const canEditRegistration = userHasAccessRight(registration, 'partial-update');

  return (
    <Paper
      elevation={0}
      sx={{ color: 'primary.contrastText' }}
      data-testid={dataTestId.registrationLandingPage.tasksPanel.panelRoot}>
      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ bgcolor: 'primary.main', px: '0.5rem' }}
        textColor="inherit"
        slotProps={{
          indicator: { style: { backgroundColor: 'white', height: '0.4rem' } },
        }}>
        {canSeeTasksPanel && (
          <Tab
            value={TabValue.Tasks}
            label={t('common.tasks')}
            data-testid={dataTestId.registrationLandingPage.tasksPanel.tabPanelTasks}
            id="action-panel-tab-0"
            aria-controls="action-panel-tab-panel-0"
          />
        )}
        <Tab
          data-testid={dataTestId.registrationLandingPage.detailsTab.detailsTab}
          value={TabValue.Details}
          label={t('details')}
          id="action-panel-tab-1"
          aria-controls="action-panel-tab-panel-1"
        />
        {canEditRegistration && (
          <Tab
            value={TabValue.Log}
            label={t('common.log')}
            data-testid={dataTestId.registrationLandingPage.tasksPanel.tabPanelLog}
            id="action-panel-tab-2"
            aria-controls="action-panel-tab-panel-2"
          />
        )}
      </Tabs>
      <TabPanel tabValue={tabValue} index={0}>
        <ErrorBoundary>
          <ActionPanelContent
            refetchData={refetchRegistrationAndTickets}
            isLoadingData={isLoadingData}
            registration={registration}
            shouldSeePublishingAccordion={shouldSeePublishingAccordion}
            shouldSeeDoiAccordion={shouldSeeDoiAccordion}
            shouldSeeSupportAccordion={shouldSeeSupportAccordion}
            publishingRequestTickets={publishingRequestTickets}
            newestDoiRequestTicket={newestDoiRequestTicket}
            newestSupportTicket={newestSupportTicket}
          />
        </ErrorBoundary>
      </TabPanel>
      <TabPanel tabValue={tabValue} index={1}>
        <DetailsPanel contributors={contributors} />
      </TabPanel>
      <TabPanel tabValue={tabValue} index={2}>
        <ErrorBoundary>
          <LogPanel registration={registration} tickets={tickets} />
        </ErrorBoundary>
      </TabPanel>
    </Paper>
  );
};

interface TabPanelProps {
  children: ReactNode;
  tabValue: TabValue;
  index: number;
}

const TabPanel = ({ children, tabValue, index }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      id={`action-panel-tab-panel-${index}`}
      aria-labelledby={`action-panel-tab-${index}`}
      hidden={tabValue !== index}>
      {tabValue === index && <>{children}</>}
    </div>
  );
};

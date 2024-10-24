import { Paper, Tab, Tabs } from '@mui/material';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { PublishingTicket, Ticket } from '../../types/publication_types/ticket.types';
import { RegistrationStatus } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { userHasAccessRight } from '../../utils/registration-helpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { ActionPanelContent } from './ActionPanelContent';
import { LogPanel } from './LogPanel';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';

enum TabValue {
  Tasks,
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

  const publishingRequestTickets = tickets.filter(
    (ticket) => ticket.type === 'PublishingRequest'
  ) as PublishingTicket[];
  const newestDoiRequestTicket = tickets.findLast((ticket) => ticket.type === 'DoiRequest');
  const newestSupportTicket = tickets.findLast((ticket) => ticket.type === 'GeneralSupportCase');

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

  const customerHasConfiguredDoi = customer?.doiAgent.username;
  const canCreateDoiTicket =
    isPublishedOrDraft && isNotOnTasksDialoguePage && userHasAccessRight(registration, 'doi-request-create');
  const canApproveDoiTicket =
    !!newestDoiRequestTicket && isPublishedOrDraft && userHasAccessRight(registration, 'doi-request-approve');

  const canCreateSupportTicket = isNotOnTasksDialoguePage && userHasAccessRight(registration, 'support-request-create');
  const canApproveSupportTicket = !!newestSupportTicket && userHasAccessRight(registration, 'support-request-approve');

  const shouldSeePublishingAccordion =
    canCreatePublishingTicket || canApprovePublishingTicket || hasOtherPublishingRights;
  const shouldSeeDoiAccordion =
    !registration.entityDescription?.reference?.doi &&
    !!customerHasConfiguredDoi &&
    (canCreateDoiTicket || canApproveDoiTicket);
  const shouldSeeSupportAccordion = canCreateSupportTicket || canApproveSupportTicket;
  const shouldSeeDelete = userHasAccessRight(registration, 'delete');

  const canSeeTasksPanel =
    shouldSeePublishingAccordion || shouldSeeDoiAccordion || shouldSeeSupportAccordion || shouldSeeDelete;

  const [tabValue, setTabValue] = useState(canSeeTasksPanel ? TabValue.Tasks : TabValue.Log);

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
        TabIndicatorProps={{ style: { backgroundColor: 'white', height: '0.4rem' } }}>
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
          value={TabValue.Log}
          label={t('common.log')}
          data-testid={dataTestId.registrationLandingPage.tasksPanel.tabPanelLog}
          id="action-panel-tab-1"
          aria-controls="action-panel-tab-panel-1"
        />
      </Tabs>
      <TabPanel tabValue={tabValue} index={0}>
        <ActionPanelContent
          refetchData={refetchRegistrationAndTickets}
          isLoadingData={isLoadingData}
          registration={registration}
          shouldSeePublishingAccordion={shouldSeePublishingAccordion}
          shouldSeeDoiAccordion={shouldSeeDoiAccordion}
          shouldSeeSupportAccordion={shouldSeeSupportAccordion}
          shouldSeeDelete={shouldSeeDelete}
          publishingRequestTickets={publishingRequestTickets}
          newestDoiRequestTicket={newestDoiRequestTicket}
          newestSupportTicket={newestSupportTicket}
        />
      </TabPanel>
      <TabPanel tabValue={tabValue} index={1}>
        <LogPanel tickets={tickets} registration={registration} />
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

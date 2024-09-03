import { Paper, Tab, Tabs } from '@mui/material';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Ticket } from '../../types/publication_types/ticket.types';
import { dataTestId } from '../../utils/dataTestIds';
import { ActionPanelContent } from './ActionPanelContent';
import { LogPanel } from './LogPanel';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';

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
  const [tabValue, setTabValue] = useState(0);

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
        <Tab
          label={t('common.tasks')}
          data-testid={dataTestId.registrationLandingPage.tasksPanel.tabPanelTasks}
          id="action-panel-tab-0"
          aria-controls="action-panel-tab-panel-0"
        />
        <Tab
          label={t('common.log')}
          data-testid={dataTestId.registrationLandingPage.tasksPanel.tabPanelLog}
          id="action-panel-tab-1"
          aria-controls="action-panel-tab-panel-1"
        />
      </Tabs>
      <TabPanel tabValue={tabValue} index={0}>
        <ActionPanelContent
          tickets={tickets}
          refetchData={refetchRegistrationAndTickets}
          isLoadingData={isLoadingData}
          registration={registration}
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
  tabValue: number;
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

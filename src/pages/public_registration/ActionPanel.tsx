import { Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StyledPaperHeader } from '../../components/PageWithSideMenu';
import { Ticket } from '../../types/publication_types/ticket.types';
import { dataTestId } from '../../utils/dataTestIds';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import { ActionPanelContent } from './ActionPanelContent';

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

  return (
    <Paper
      elevation={0}
      data-testid={dataTestId.registrationLandingPage.tasksPanel.panelRoot}
      sx={{ gridArea: 'tasks' }}>
      <StyledPaperHeader>
        <Typography color="inherit" variant="h1">
          {t('common.tasks')}
        </Typography>
      </StyledPaperHeader>
      <ActionPanelContent
        tickets={tickets}
        refetchData={refetchRegistrationAndTickets}
        isLoadingData={isLoadingData}
        registration={registration}
      />
    </Paper>
  );
};

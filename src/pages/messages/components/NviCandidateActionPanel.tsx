import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Divider, Paper, styled, Tab, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchRegistration } from '../../../api/hooks/useFetchRegistration';
import { useFetchRegistrationTickets } from '../../../api/hooks/useFetchRegistrationTickets';
import { NviCandidate } from '../../../types/nvi.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { LogPanel } from '../../public_registration/LogPanel';
import { NviApprovals } from './NviApprovals';
import { NviCandidateActions } from './NviCandidateActions';

interface NviCandidateActionPanelProps {
  nviCandidate: NviCandidate;
  nviCandidateQueryKey: string[];
}

enum TabValue {
  Dialogue = 'Dialogue',
  Log = 'Log',
}

const StyledTabPanel = styled(TabPanel)({
  padding: 0,
});

export const NviCandidateActionPanel = ({ nviCandidate, nviCandidateQueryKey }: NviCandidateActionPanelProps) => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(TabValue.Dialogue);

  const ticketsQuery = useFetchRegistrationTickets(nviCandidate.publicationId);
  const registrationQuery = useFetchRegistration(getIdentifierFromId(nviCandidate.publicationId));

  const tickets = ticketsQuery.data?.tickets ?? [];
  const periodStatus = nviCandidate?.period.status;
  const pointsSum = nviCandidate?.approvals.reduce((acc, curr) => acc + curr.points, 0) ?? 0;

  return (
    <Paper
      elevation={0}
      sx={{
        gridArea: 'nvi',
        bgcolor: tabValue === TabValue.Dialogue ? 'nvi.light' : 'registration.light',
        height: 'fit-content',
        minHeight: { sm: '85vh' },
        display: 'flex',
        flexDirection: 'column',
      }}>
      <TabContext value={tabValue}>
        <TabList
          onChange={(_, newValue: TabValue) => setTabValue(newValue)}
          sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', px: '0.5rem' }}
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: 'white', height: '0.4rem' } }}>
          <Tab
            label={t('common.dialogue')}
            value={TabValue.Dialogue}
            data-testid={dataTestId.tasksPage.nvi.dialogTabButton}
          />
          <Tab label={t('common.log')} value={TabValue.Log} data-testid={dataTestId.tasksPage.nvi.logTabButton} />
        </TabList>

        <StyledTabPanel value={TabValue.Dialogue}>
          {periodStatus === 'OpenPeriod' && nviCandidate ? (
            <NviCandidateActions nviCandidate={nviCandidate} nviCandidateQueryKey={nviCandidateQueryKey} />
          ) : periodStatus === 'ClosedPeriod' ? (
            <Typography sx={{ p: '1rem', bgcolor: 'nvi.main' }}>{t('tasks.nvi.reporting_period_closed')}</Typography>
          ) : periodStatus === 'NoPeriod' ? (
            <Typography sx={{ p: '1rem', bgcolor: 'nvi.main' }}>{t('tasks.nvi.reporting_period_missing')}</Typography>
          ) : null}

          <Divider sx={{ mt: 'auto' }} />
          <NviApprovals approvals={nviCandidate?.approvals ?? []} totalPoints={pointsSum} />
        </StyledTabPanel>
        <StyledTabPanel value={TabValue.Log}>
          {registrationQuery.data && <LogPanel tickets={tickets} registration={registrationQuery.data} />}
        </StyledTabPanel>
      </TabContext>
    </Paper>
  );
};
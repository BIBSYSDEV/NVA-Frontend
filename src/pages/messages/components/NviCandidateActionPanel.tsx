import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Paper, styled, Tab } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchRegistration } from '../../../api/hooks/useFetchRegistration';
import { useFetchRegistrationTickets } from '../../../api/hooks/useFetchRegistrationTickets';
import { NviCandidate } from '../../../types/nvi.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { userHasAccessRight } from '../../../utils/registration-helpers';
import { LogPanel } from '../../public_registration/log/LogPanel';
import { NviDialoguePanel } from './NviDialoguePanel';

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
  paddingBottom: '1rem',
});

export const NviCandidateActionPanel = ({ nviCandidate, nviCandidateQueryKey }: NviCandidateActionPanelProps) => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(TabValue.Dialogue);

  const registrationQuery = useFetchRegistration(getIdentifierFromId(nviCandidate.publicationId));
  const canEditRegistration = userHasAccessRight(registrationQuery.data, 'partial-update');

  const ticketsQuery = useFetchRegistrationTickets(nviCandidate.publicationId, { enabled: canEditRegistration });
  const tickets = ticketsQuery.data?.tickets ?? [];

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
          slotProps={{ indicator: { sx: { backgroundColor: 'white', height: '0.4rem' } } }}>
          <Tab
            label={t('common.dialogue')}
            value={TabValue.Dialogue}
            data-testid={dataTestId.tasksPage.nvi.dialogTabButton}
          />
          {canEditRegistration && (
            <Tab label={t('common.log')} value={TabValue.Log} data-testid={dataTestId.tasksPage.nvi.logTabButton} />
          )}
        </TabList>

        <StyledTabPanel value={TabValue.Dialogue}>
          <NviDialoguePanel nviCandidate={nviCandidate} nviCandidateQueryKey={nviCandidateQueryKey} />
        </StyledTabPanel>
        {canEditRegistration && (
          <StyledTabPanel value={TabValue.Log}>
            {registrationQuery.data && <LogPanel tickets={tickets} registration={registrationQuery.data} />}
          </StyledTabPanel>
        )}
      </TabContext>
    </Paper>
  );
};

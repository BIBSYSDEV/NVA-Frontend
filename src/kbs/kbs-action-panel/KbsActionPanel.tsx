import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { Accordion, AccordionDetails, Box } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TaskAccordionSummary } from '../../pages/public_registration/action_accordions/styles';
import { KbsStatusChip } from './_components/KbsStatusChip';
import { KbsStatus } from './kbs.types';

export const KbsActionPanel = () => {
  const { t } = useTranslation();
  // TODO: Read the status from the mocked KBS data
  const [status] = useState(KbsStatus.NotAssessed);

  return (
    <Accordion
      defaultExpanded
      elevation={3}
      sx={{
        bgcolor: 'background.paper',
        '& .MuiAccordionSummary-content': {
          alignItems: 'center',
          gap: '0.5rem',
        },
      }}>
      <TaskAccordionSummary sx={{ borderLeftColor: 'project.main' }} expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <ShieldOutlinedIcon aria-hidden="true" />
        {t('kbs')}
        <Box sx={{ ml: 'auto' }}>
          <KbsStatusChip status={status} />
        </Box>
      </TaskAccordionSummary>
      {/* TODO: Show the content for the current status */}
      <AccordionDetails />
    </Accordion>
  );
};

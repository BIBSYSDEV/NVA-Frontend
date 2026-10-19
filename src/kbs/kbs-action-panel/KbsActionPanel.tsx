import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { Accordion, AccordionDetails, Box } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TaskAccordionSummary } from '../../pages/public_registration/action_accordions/styles';
import { KbsAssessmentForm } from './_components/KbsAssessmentForm';
import { KbsStatusChip } from './_components/KbsStatusChip';
import { KbsAssessmentAnswer, KbsStatus } from './kbs.types';

export const KbsActionPanel = () => {
  const { t } = useTranslation();
  // TODO: Read the status from the mocked KBS data
  const [status, setStatus] = useState(KbsStatus.NotAssessed);

  const saveAssessment = (answer: KbsAssessmentAnswer) => {
    // TODO: The other answers are waiting for design
    if (answer === KbsAssessmentAnswer.Yes) {
      setStatus(KbsStatus.Candidate);
    }
  };

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
      <AccordionDetails>
        {status === KbsStatus.NotAssessed && <KbsAssessmentForm onSave={saveAssessment} />}
        {/* TODO: Show the content for the other statuses */}
      </AccordionDetails>
    </Accordion>
  );
};

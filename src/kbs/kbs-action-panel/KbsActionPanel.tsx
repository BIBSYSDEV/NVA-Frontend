import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { Accordion, AccordionDetails, Box } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TaskAccordionSummary } from '../../pages/public_registration/action_accordions/styles';
import { KbsAssessmentForm } from './_components/KbsAssessmentForm';
import { KbsPatientsForm } from './_components/KbsPatientsForm';
import { KbsStatusChip } from './_components/KbsStatusChip';
import { kbsMockInstitutions } from './_utils/kbs-mock-institutions';
import { KbsAssessmentAnswer, KbsStatus } from './kbs.types';

export const KbsActionPanel = () => {
  const { t } = useTranslation();
  // TODO: Read the status and year from the mocked KBS data
  const [status, setStatus] = useState(KbsStatus.NotAssessed);
  const [year] = useState(new Date().getFullYear());

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
        {status === KbsStatus.Candidate && (
          <KbsPatientsForm
            year={year}
            institutions={kbsMockInstitutions}
            // TODO: Keep the patient counts for the read-only table
            onDeliver={() => setStatus(KbsStatus.Delivered)}
          />
        )}
        {/* TODO: Show the content for the other statuses */}
      </AccordionDetails>
    </Accordion>
  );
};

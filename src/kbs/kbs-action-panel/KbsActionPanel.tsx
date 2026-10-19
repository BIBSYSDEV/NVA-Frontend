import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { Accordion, AccordionDetails, Box } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TaskAccordionSummary } from '../../pages/public_registration/action_accordions/styles';
import { KbsAssessmentForm } from './_components/KbsAssessmentForm';
import { KbsPatientsForm } from './_components/KbsPatientsForm';
import { KbsPatientsTable } from './_components/KbsPatientsTable';
import { KbsRequirementConfirmation } from './_components/KbsRequirementConfirmation';
import { KbsStatusChip } from './_components/KbsStatusChip';
import { kbsMockInstitutions } from './_utils/kbs-mock-institutions';
import { KbsAssessmentAnswer, KbsPatientCounts, KbsStatus } from './kbs.types';

export const KbsActionPanel = () => {
  const { t } = useTranslation();
  // TODO: Read the status and year from the mocked KBS data
  const [status, setStatus] = useState(KbsStatus.NotAssessed);
  const [year] = useState(new Date().getFullYear());
  const [patientCounts, setPatientCounts] = useState<Partial<KbsPatientCounts>>({});

  const saveAssessment = (answer: KbsAssessmentAnswer) => {
    // TODO: The other answers are waiting for design
    if (answer === KbsAssessmentAnswer.Yes) {
      setStatus(KbsStatus.Candidate);
    }
  };

  const deliverPatientCounts = (deliveredPatientCounts: KbsPatientCounts) => {
    setPatientCounts(deliveredPatientCounts);
    setStatus(KbsStatus.Delivered);
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
        {status !== KbsStatus.NotAssessed && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <KbsRequirementConfirmation />
            {status === KbsStatus.Candidate ? (
              <KbsPatientsForm year={year} institutions={kbsMockInstitutions} onDeliver={deliverPatientCounts} />
            ) : (
              <KbsPatientsTable year={year} institutions={kbsMockInstitutions} patientCounts={patientCounts} />
            )}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

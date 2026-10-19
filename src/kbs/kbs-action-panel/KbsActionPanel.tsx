import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { Accordion, AccordionDetails, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TaskAccordionSummary } from '../../pages/public_registration/action_accordions/styles';
import { KbsReportState } from '../_hooks/useKbsReport';
import { canEditKbs } from '../_utils/kbs-role-helpers';
import { KbsAssessmentForm } from './_components/KbsAssessmentForm';
import { KbsPatientsForm } from './_components/KbsPatientsForm';
import { KbsPatientsTable } from './_components/KbsPatientsTable';
import { KbsRequirementConfirmation } from './_components/KbsRequirementConfirmation';
import { KbsStatusChip } from './_components/KbsStatusChip';
import { kbsMockInstitutions } from './_utils/kbs-mock-institutions';
import { KbsRole, KbsStatus } from './kbs.types';

interface KbsActionPanelProps {
  role: KbsRole;
  kbsReport: KbsReportState;
}

export const KbsActionPanel = ({ role, kbsReport }: KbsActionPanelProps) => {
  const { t } = useTranslation();
  const { status, year, assessmentAnswer, patientCounts, saveAssessment, deliverPatientCounts } = kbsReport;

  const canEdit = canEditKbs(role);
  const showPatientsForm = canEdit && status === KbsStatus.Candidate;

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
        {status === KbsStatus.NotAssessed && canEdit && (
          <KbsAssessmentForm key={assessmentAnswer} savedAnswer={assessmentAnswer} onSave={saveAssessment} />
        )}
        {status !== KbsStatus.NotAssessed && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {canEdit && <KbsRequirementConfirmation />}
            {showPatientsForm && (
              <KbsPatientsForm
                key={year}
                year={year}
                institutions={kbsMockInstitutions}
                onDeliver={deliverPatientCounts}
              />
            )}
            {!showPatientsForm && (
              <KbsPatientsTable year={year} institutions={kbsMockInstitutions} patientCounts={patientCounts} />
            )}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

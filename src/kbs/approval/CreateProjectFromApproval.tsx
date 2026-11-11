import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateProjectAccordion } from '../../pages/project/project_wizard/CreateProjectAccordion';
import { ProjectOrganization, SaveCristinProject } from '../../types/project.types';
import { ApprovalSearch } from './_components/ApprovalSearch';
import { useApprovalDraft } from './ApprovalDraftContext';
import { Approval } from './approval.types';

interface CreateProjectFromApprovalProps {
  newProject: SaveCristinProject;
  setNewProject: (project: SaveCristinProject) => void;
  setShowProjectForm: (show: boolean) => void;
  coordinatingInstitution: ProjectOrganization;
}

export const CreateProjectFromApproval = ({
  newProject,
  setNewProject,
  setShowProjectForm,
  coordinatingInstitution,
}: CreateProjectFromApprovalProps) => {
  const { t } = useTranslation();
  const { setApproval } = useApprovalDraft();
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);

  const startProjectFromApproval = () => {
    if (!selectedApproval) {
      return;
    }
    setApproval(selectedApproval);
    setNewProject({ ...newProject, title: selectedApproval.title, coordinatingInstitution });
    setShowProjectForm(true);
  };

  return (
    <CreateProjectAccordion
      headline={t('start_with_approval')}
      description={t('start_with_approval_description')}
      testId="create-project-from-approval-accordion"
      icon={<CheckCircleOutlineOutlinedIcon sx={{ height: '3rem', width: '3rem', mr: '0.75rem' }} />}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <ApprovalSearch selectedApproval={selectedApproval} onChange={setSelectedApproval} />
        <Button
          color="secondary"
          variant="contained"
          sx={{ width: 'fit-content', alignSelf: 'end', mt: '1rem' }}
          disabled={!selectedApproval}
          onClick={startProjectFromApproval}
          endIcon={<EastOutlinedIcon />}>
          {t('project.form.start_registering_project')}
        </Button>
      </Box>
    </CreateProjectAccordion>
  );
};

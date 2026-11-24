import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ApprovalSearch } from '../../../../components/approval-search/ApprovalSearch';
import { RootState } from '../../../../redux/store';
import { Approval } from '../../../../types/approval.types';
import { ProjectOrganization, SaveCristinProject } from '../../../../types/project.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { CreateProjectAccordion } from '../CreateProjectAccordion';
import { createProjectFromApproval } from './_utils/create-approval-project-helpers';

interface CreateApprovalProjectProps {
  newProject: SaveCristinProject;
  setNewProject: (project: SaveCristinProject) => void;
  setShowProjectForm: (show: boolean) => void;
  coordinatingInstitution: ProjectOrganization;
  isLoadingCoordinatingInstitution: boolean;
}

export const CreateApprovalProject = ({
  newProject,
  setNewProject,
  setShowProjectForm,
  coordinatingInstitution,
  isLoadingCoordinatingInstitution,
}: CreateApprovalProjectProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);

  const startApprovalProject = () => {
    if (!selectedApproval) {
      return;
    }

    setNewProject(createProjectFromApproval(newProject, selectedApproval, user, coordinatingInstitution));
    setShowProjectForm(true);
  };

  return (
    <CreateProjectAccordion
      headline={t('start_with_approval')}
      description={t('start_with_approval_description')}
      testId={dataTestId.newProjectPage.createApprovalProjectAccordion}
      icon={<CheckCircleOutlineOutlinedIcon sx={{ height: '3rem', width: '3rem', mr: '0.75rem' }} />}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <ApprovalSearch
          selectedApproval={selectedApproval}
          onChange={setSelectedApproval}
          dataTestId={dataTestId.newProjectPage.approvalSearchInput}
        />
        <Button
          color="secondary"
          variant="contained"
          sx={{ width: 'fit-content', alignSelf: 'end', mt: '1rem' }}
          disabled={!selectedApproval || isLoadingCoordinatingInstitution}
          onClick={startApprovalProject}
          endIcon={<EastOutlinedIcon />}
          data-testid={dataTestId.newProjectPage.startApprovalProjectButton}>
          {t('project.form.start_registering_project')}
        </Button>
      </Box>
    </CreateProjectAccordion>
  );
};

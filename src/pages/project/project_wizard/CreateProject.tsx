import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { CancelButton } from '../../../components/buttons/CancelButton';
import { PageHeader } from '../../../components/PageHeader';
import {
  StyledPageContent,
  StyledRightAlignedFooter,
  WizardStartPageWrapper,
} from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { CristinProject, emptyProject, ResearchProject } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { CreateNfrProject } from './CreateNfrProject';
import { EmptyProjectForm } from './EmptyProjectForm';
import { ProjectForm } from './ProjectForm';

interface CreateProjectProps {
  toggleModal?: () => void;
  onProjectCreated?: (value: CristinProject | ResearchProject) => void;
}

const CreateProject = ({ toggleModal, onProjectCreated }: CreateProjectProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const user = useSelector((store: RootState) => store.user);
  const topOrgCristinId = user?.topOrgCristinId ?? '';
  const currentInstitutionQuery = useFetchOrganization(topOrgCristinId);
  const [newProject, setNewProject] = useState(emptyProject);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [suggestedProjectManager, setSuggestedProjectManager] = useState('');

  return (
    <StyledPageContent>
      {showProjectForm ? (
        <ProjectForm
          project={newProject}
          suggestedProjectManager={suggestedProjectManager}
          toggleModal={toggleModal}
          onProjectCreated={onProjectCreated}
        />
      ) : (
        <>
          <PageHeader>{t('project.create_project')}</PageHeader>
          <WizardStartPageWrapper>
            <CreateNfrProject
              newProject={newProject}
              setNewProject={setNewProject}
              setShowProjectForm={setShowProjectForm}
              setSuggestedProjectManager={setSuggestedProjectManager}
              coordinatingInstitution={currentInstitutionQuery.data ?? emptyProject.coordinatingInstitution}
            />
            <EmptyProjectForm
              newProject={newProject}
              setNewProject={setNewProject}
              setShowProjectForm={setShowProjectForm}
            />
          </WizardStartPageWrapper>
          <StyledRightAlignedFooter sx={{ mt: '2rem' }}>
            <CancelButton
              testId={dataTestId.projectForm.cancelNewProjectButton}
              onClick={() => (toggleModal ? toggleModal() : history.push(UrlPathTemplate.MyPageMyProjectRegistrations))}
            />
          </StyledRightAlignedFooter>
        </>
      )}
    </StyledPageContent>
  );
};

export default CreateProject;

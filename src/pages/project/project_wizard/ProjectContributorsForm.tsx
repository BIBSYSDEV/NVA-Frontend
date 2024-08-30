import { Box } from '@mui/material';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { ProjectTabs } from '../../../types/project.types';
import { ProjectContributors } from '../../projects/form/ProjectContributors';
import { ProjectManager } from './ProjectManager';
import { FormBox } from './styles';

interface ProjectContributorsFormProps {
  suggestedProjectManager?: string;
  maxVisitedTab: ProjectTabs;
}

export const ProjectContributorsForm = ({ suggestedProjectManager, maxVisitedTab }: ProjectContributorsFormProps) => {
  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormBox>
          <ProjectManager
            suggestedProjectManager={suggestedProjectManager}
            isVisited={maxVisitedTab >= ProjectTabs.Contributors}
          />
        </FormBox>
        <FormBox>
          <ProjectContributors />
        </FormBox>
      </Box>
    </ErrorBoundary>
  );
};

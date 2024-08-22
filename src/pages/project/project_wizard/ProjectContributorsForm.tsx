import { Box } from '@mui/material';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { ProjectTabs } from '../../../types/project.types';
import { ProjectContributors } from '../../projects/form/ProjectContributors';

interface ProjectContributorsFormProps {
  suggestedProjectManager?: string;
  maxVisitedTab: ProjectTabs;
}

export const ProjectContributorsForm = ({ suggestedProjectManager, maxVisitedTab }: ProjectContributorsFormProps) => {
  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <ProjectContributors
          suggestedProjectManager={suggestedProjectManager}
          isVisited={maxVisitedTab > ProjectTabs.Contributors}
        />
      </Box>
    </ErrorBoundary>
  );
};

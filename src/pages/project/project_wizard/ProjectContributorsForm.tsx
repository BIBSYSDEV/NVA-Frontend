import { Box } from '@mui/material';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { ProjectContributors } from '../../projects/form/ProjectContributors';

interface ProjectContributorsFormProps {
  suggestedProjectManager?: string;
}

export const ProjectContributorsForm = ({ suggestedProjectManager }: ProjectContributorsFormProps) => {
  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <ProjectContributors suggestedProjectManager={suggestedProjectManager} />
      </Box>
    </ErrorBoundary>
  );
};

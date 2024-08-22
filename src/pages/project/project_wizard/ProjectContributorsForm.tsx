import { Box } from '@mui/material';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { ProjectContributors } from '../../projects/form/ProjectContributors';

interface ProjectContributorsFormProps {
  suggestedProjectManager?: string;
  thisIsRekProject: boolean;
}

export const ProjectContributorsForm = ({
  thisIsRekProject,
  suggestedProjectManager,
}: ProjectContributorsFormProps) => {
  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <ProjectContributors thisIsRekProject={thisIsRekProject} suggestedProjectManager={suggestedProjectManager} />
      </Box>
    </ErrorBoundary>
  );
};

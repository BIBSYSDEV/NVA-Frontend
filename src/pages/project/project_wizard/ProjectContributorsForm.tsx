import { Box } from '@mui/material';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { ProjectContributorType } from '../../../types/project.types';
import { ProjectParticipants } from '../../projects/form/ProjectParticipants';
import { ProjectManager } from './ProjectManager';
import { FormBox } from './styles';

export const nonProjectManagerRoles: ProjectContributorType[] = ['ProjectParticipant', 'LocalManager'];

interface ProjectContributorsFormProps {
  suggestedProjectManager?: string;
}

export const ProjectContributorsForm = ({ suggestedProjectManager }: ProjectContributorsFormProps) => {
  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormBox>
          <ProjectManager suggestedProjectManager={suggestedProjectManager} />
        </FormBox>
        <FormBox>
          <ProjectParticipants />
        </FormBox>
      </Box>
    </ErrorBoundary>
  );
};

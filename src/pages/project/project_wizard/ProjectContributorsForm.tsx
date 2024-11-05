import { Box } from '@mui/material';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { ProjectParticipants } from '../../projects/form/ProjectParticipants';
import { ProjectManager } from './ProjectManager';
import { FormBox } from './styles';

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
          <ProjectParticipants roleType={'LocalProjectManager'} />
        </FormBox>
        <FormBox>
          <ProjectParticipants roleType={'ProjectParticipant'} />
        </FormBox>
      </Box>
    </ErrorBoundary>
  );
};

import { Box } from '@mui/material';
import { BetaFunctionality } from '../../../components/BetaFunctionality';
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
        <BetaFunctionality>
          <FormBox>
            <ProjectParticipants roleType={'LocalManager'} />
          </FormBox>
        </BetaFunctionality>
        <FormBox>
          <ProjectParticipants roleType={'ProjectParticipant'} />
        </FormBox>
      </Box>
    </ErrorBoundary>
  );
};

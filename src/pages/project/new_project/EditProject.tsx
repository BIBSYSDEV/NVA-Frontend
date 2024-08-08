import { useParams } from 'react-router-dom';
import { StyledPageContent } from '../../../components/styled/Wrappers';
import { IdentifierParams } from '../../../utils/urlPaths';
import { ProjectForm } from './ProjectForm';

const EditProject = () => {
  const { identifier } = useParams<IdentifierParams>();

  return (
    <StyledPageContent>
      <ProjectForm />
    </StyledPageContent>
  );
};

export default EditProject;

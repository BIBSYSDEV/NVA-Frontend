import { StyledPageContent } from '../../../components/styled/Wrappers';
import { ProjectForm } from './ProjectForm';

const EditProject = () => {
  //const { identifier } = useParams<IdentifierParams>();

  return (
    <StyledPageContent>
      <ProjectForm />
    </StyledPageContent>
  );
};

export default EditProject;

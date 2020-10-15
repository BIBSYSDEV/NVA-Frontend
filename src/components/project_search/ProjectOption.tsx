import React, { FC } from 'react';
import { AutocompleteRenderOptionState } from '@material-ui/lab';
import { CristinProject } from '../../types/project.types';
import { getProjectTitleParts } from './helpers';
import { StyledFlexColumn } from '../styled/Wrappers';
import ProjectTitle from './ProjectTitle';
import ProjectInstitutions from './ProjectInstitutions';

interface ProjectOptionProps {
  project: CristinProject;
  state: AutocompleteRenderOptionState;
}

const ProjectOption: FC<ProjectOptionProps> = ({ project, state }) => {
  const searchTerm = state.inputValue.toLocaleLowerCase();
  const parts = getProjectTitleParts(project, searchTerm);

  return (
    <StyledFlexColumn>
      <ProjectTitle>
        {parts.map((part, index) => (
          <span
            key={index}
            style={{
              fontWeight: part.toLocaleLowerCase() === searchTerm ? 700 : 400,
            }}>
            {part}
          </span>
        ))}
      </ProjectTitle>
      <ProjectInstitutions project={project} />
    </StyledFlexColumn>
  );
};

export default ProjectOption;

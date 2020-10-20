import React, { FC } from 'react';
import { AutocompleteRenderOptionState } from '@material-ui/lab';
import { getProjectTitleParts } from './helpers';
import ProjectInstitutions from './ProjectInstitutions';
import ProjectTitle from './ProjectTitle';
import { CristinProject } from '../../../../types/project.types';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';

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

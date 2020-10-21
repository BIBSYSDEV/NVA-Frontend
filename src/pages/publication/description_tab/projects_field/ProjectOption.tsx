import React, { FC } from 'react';
import { AutocompleteRenderOptionState } from '@material-ui/lab';
import { Typography } from '@material-ui/core';
import { getTextParts, getProjectTitle } from './helpers';
import ProjectInstitutions from './ProjectInstitutions';
import { CristinProject } from '../../../../types/project.types';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';

interface ProjectOptionProps {
  project: CristinProject;
  state: AutocompleteRenderOptionState;
}

const ProjectOption: FC<ProjectOptionProps> = ({ project, state }) => {
  const searchTerm = state.inputValue.toLocaleLowerCase();
  const parts = getTextParts(getProjectTitle(project), searchTerm);

  return (
    <StyledFlexColumn>
      <Typography variant="subtitle1">
        {parts.map((part, index) => (
          <span
            key={index}
            style={{
              fontWeight: part.toLocaleLowerCase() === searchTerm ? 700 : 400,
            }}>
            {part}
          </span>
        ))}
      </Typography>
      <ProjectInstitutions project={project} />
    </StyledFlexColumn>
  );
};

export default ProjectOption;

import React, { FC } from 'react';
import { ChipProps, Chip } from '@material-ui/core';
import styled from 'styled-components';
import { CristinProject } from '../../types/project.types';
import { StyledFlexColumn } from '../styled/Wrappers';
import { getProjectTitle } from './helpers';
import ProjectInstitutions from './ProjectInstitutions';
import ProjectTitle from './ProjectTitle';

interface ProjectChipProps extends ChipProps {
  project: CristinProject;
}

const StyledProjectChip = styled(Chip)`
  height: auto;
`;

const ProjectChip: FC<ProjectChipProps> = ({ project, ...rest }) => (
  <StyledProjectChip
    {...rest}
    label={
      <StyledFlexColumn>
        <ProjectTitle>{getProjectTitle(project)}</ProjectTitle>
        <ProjectInstitutions project={project} />
      </StyledFlexColumn>
    }
  />
);

export default ProjectChip;

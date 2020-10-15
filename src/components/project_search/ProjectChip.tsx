import React, { FC } from 'react';
import { ChipProps, Chip, Typography } from '@material-ui/core';
import { CristinProject } from '../../types/project.types';
import styled from 'styled-components';
import { StyledFlexColumn } from '../styled/Wrappers';
import { getProjectTitle } from './helpers';
import ProjectInstitutions from './ProjectInstitutions';

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
        <Typography variant="subtitle1">{getProjectTitle(project)}</Typography>
        <ProjectInstitutions project={project} />
      </StyledFlexColumn>
    }
  />
);

export default ProjectChip;

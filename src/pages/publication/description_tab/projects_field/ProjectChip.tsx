import React, { FC } from 'react';
import { ChipProps, Chip, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { getProjectTitle } from './helpers';
import ProjectInstitutions from './ProjectInstitutions';
import { CristinProject } from '../../../../types/project.types';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';

interface ProjectChipProps extends ChipProps {
  project: CristinProject;
}

const StyledProjectChip = styled(Chip)`
  height: auto;
`;

const ProjectChip: FC<ProjectChipProps> = ({ project, ...rest }) => (
  <StyledProjectChip
    data-testid="project-chip"
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

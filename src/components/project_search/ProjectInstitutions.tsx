import React, { FC } from 'react';
import { Typography } from '@material-ui/core';
import { CristinProject } from '../../types/project.types';

interface ProjectInstitutionsProps {
  project: CristinProject;
}

const ProjectInstitutions: FC<ProjectInstitutionsProps> = ({ project }) =>
  project.institutions.length > 0 ? (
    <Typography variant="body2" color="textSecondary">
      {project.institutions.map((institution) => institution.name).join(', ')}
    </Typography>
  ) : null;

export default ProjectInstitutions;

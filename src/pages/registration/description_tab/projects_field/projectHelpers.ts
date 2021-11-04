import { CristinProject } from '../../../../types/project.types';
import { getLanguageString } from '../../../../utils/translation-helpers';

export const getProjectName = (project?: CristinProject) =>
  project ? getLanguageString(project.coordinatingInstitution.name) : '';

export const getProjectManagerName = (project?: CristinProject) => {
  const projectManager = project?.contributors.find((contributor) => contributor.type === 'ProjectManager');
  const projectManagerName = projectManager
    ? `${projectManager.identity.firstName} ${projectManager.identity.lastName}`
    : '';
  return projectManagerName;
};

export const getProjectPeriod = (project?: CristinProject) => {
  if (!project) {
    return '';
  }
  const startDate = new Date(project.startDate);
  const endDate = project.endDate && new Date(project.endDate);
  const dateInterval = [
    startDate.toLocaleDateString(),
    endDate && !isNaN(endDate.valueOf()) ? endDate.toLocaleDateString() : '?',
  ].join(' - ');

  return dateInterval;
};

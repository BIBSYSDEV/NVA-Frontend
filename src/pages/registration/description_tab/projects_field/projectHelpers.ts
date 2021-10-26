import { CristinProject, ResearchProject } from '../../../../types/project.types';
import { getLanguageString } from '../../../../utils/translation-helpers';

export const convertToResearchProject = (project: CristinProject): ResearchProject => ({
  type: 'ResearchProject',
  id: project.id,
  name: project.title,
  grants: [],
  approvals: [],
});

export const convertToCristinProject = (project: ResearchProject): CristinProject => ({
  type: 'Project',
  id: project.id,
  title: project.name,
  alternativeTitles: [],
  identifier: [],
  language: '',
  contributors: [],
  startDate: '',
  endDate: '',
  coordinatingInstitution: { id: '', type: 'Organization', name: {} },
  status: 'ACTIVE',
  academicSummary: {},
  popularScientificSummary: {},
});

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

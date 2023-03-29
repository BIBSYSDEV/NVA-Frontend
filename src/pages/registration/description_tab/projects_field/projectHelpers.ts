import { CristinProject, ProjectContributor, ProjectContributorIdentity } from '../../../../types/project.types';
import { CristinPerson, User } from '../../../../types/user.types';
import { getLanguageString } from '../../../../utils/translation-helpers';

export const getProjectCoordinatingInstitutionName = (project?: CristinProject) =>
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

export const getProjectManagers = (contributors: ProjectContributor[]) =>
  contributors.filter((contributor) => contributor.type === 'ProjectManager');

export const getProjectParticipants = (contributors: ProjectContributor[]) =>
  contributors.filter((contributor) => contributor.type === 'ProjectParticipant');

export const getNfrProjectUrl = (identifier: string) => {
  const splittedIdentifier = identifier ? identifier.split('/') : []; // Some identifiers have a slash for some reason, eg: project 558223
  const projectIdentifier = splittedIdentifier.length > 0 ? splittedIdentifier[0] : null;
  return projectIdentifier ? `https://prosjektbanken.forskningsradet.no/project/FORISS/${projectIdentifier}` : '';
};

export const canEditProject = (user: User | null, project?: CristinProject) => {
  if (!user || !project) {
    return false;
  }
  const projectManagers = getProjectManagers(project.contributors);
  return !!user.cristinId && projectManagers.some((projectManager) => projectManager.identity.id === user.cristinId);
};

export const projectContributorToCristinPerson = (
  contributorIdentity?: ProjectContributorIdentity
): CristinPerson | null =>
  contributorIdentity
    ? {
        id: contributorIdentity.id,
        identifiers: [],
        names: [
          { type: 'FirstName', value: contributorIdentity.firstName },
          { type: 'LastName', value: contributorIdentity.lastName },
        ],
        affiliations: [],
        employments: [],
      }
    : null;

export const fundingSourceIsNfr = (sourceId = '') => sourceId.split('/').pop()?.toUpperCase() === 'NFR';

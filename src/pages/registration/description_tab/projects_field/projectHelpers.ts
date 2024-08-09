import { CristinProject, ProjectContributor, ProjectContributorIdentity } from '../../../../types/project.types';
import { CristinPerson, User } from '../../../../types/user.types';
import { toDateString } from '../../../../utils/date-helpers';
import { getLanguageString } from '../../../../utils/translation-helpers';

export const getProjectCoordinatingInstitutionName = (project?: CristinProject) =>
  project ? getLanguageString(project.coordinatingInstitution.labels) : '';

export const getProjectManagerName = (project?: CristinProject) => {
  const projectManager = project?.contributors.find((contributor) => isProjectManager(contributor));
  return projectManager ? `${projectManager.identity.firstName} ${projectManager.identity.lastName}` : '';
};

export const getProjectPeriod = (project?: CristinProject) => {
  if (!project) {
    return '';
  }
  const startDate = new Date(project.startDate);
  const endDate = project.endDate && new Date(project.endDate);
  const dateInterval = [
    toDateString(startDate),
    endDate && !isNaN(endDate.valueOf()) ? toDateString(endDate) : '?',
  ].join(' - ');

  return dateInterval;
};

export const isProjectManager = (contributor: ProjectContributor) =>
  contributor.roles.some((role) => role.type === 'ProjectManager');

export const getProjectManagers = (contributors: ProjectContributor[]) =>
  contributors.filter((contributor) => isProjectManager(contributor));

export const getProjectParticipants = (contributors: ProjectContributor[]) =>
  contributors.filter((contributor) => contributor.roles.some((role) => role.type === 'ProjectParticipant'));

export const getNfrProjectUrl = (identifier: string) => {
  const splittedIdentifier = identifier ? identifier.split('/') : []; // Some identifiers have a slash for some reason, eg: project 558223
  const projectIdentifier = splittedIdentifier.length > 0 ? splittedIdentifier[0] : null;
  return projectIdentifier ? `https://prosjektbanken.forskningsradet.no/project/FORISS/${projectIdentifier}` : '';
};

export const canEditProject = (user: User | null, project?: CristinProject) => {
  if (!user || !project || !user.cristinId) {
    return false;
  }

  const isProjectManager = getProjectManagers(project.contributors).some(
    (projectManager) => projectManager.identity.id === user.cristinId
  );
  const isProjectOwner = project.creator?.identity.id === user.cristinId;

  return isProjectManager || isProjectOwner;
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
        background: {},
        keywords: [],
      }
    : null;

export const isRekProject = (project?: CristinProject) => project?.created.sourceShortName === 'REK';

export const fundingSourceIsNfr = (sourceId = '') => sourceId.split('/').pop()?.toUpperCase() === 'NFR';

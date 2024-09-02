import { CristinProject, ProjectContributor } from '../../../../types/project.types';
import { User } from '../../../../types/user.types';
import { toDateString } from '../../../../utils/date-helpers';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { isNonProjectManagerRole, isProjectManagerRole } from '../../../project/helpers/projectContributorRoleHelpers';

export const getProjectCoordinatingInstitutionName = (project?: CristinProject) =>
  project ? getLanguageString(project.coordinatingInstitution.labels) : '';

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

const isProjectManager = (contributor: ProjectContributor) =>
  contributor.roles.some((role) => isProjectManagerRole(role));

export const getProjectManagers = (contributors: ProjectContributor[]) =>
  contributors.filter((contributor) => isProjectManager(contributor));

export const getProjectParticipants = (contributors: ProjectContributor[]) =>
  contributors.filter((contributor) => contributor.roles.some((role) => isNonProjectManagerRole(role)));

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

export const isRekProject = (project?: CristinProject) => project?.created.sourceShortName === 'REK';

export const fundingSourceIsNfr = (sourceId = '') => sourceId.split('/').pop()?.toUpperCase() === 'NFR';

import { CristinProject, ResearchProject } from '../../../../types/project.types';
import { BackendTypeNames } from '../../../../types/publication_types/commonRegistration.types';

export const convertToResearchProject = (project: CristinProject): ResearchProject => ({
  type: BackendTypeNames.RESEARCH_PROJECT,
  id: project.id,
  name: project.title,
  grants: [],
  approvals: [],
});

export const convertToCristinProject = (project: ResearchProject): CristinProject => ({
  type: 'Project',
  id: project.id,
  language: '',
  title: project.name,
  contributors: [],
});

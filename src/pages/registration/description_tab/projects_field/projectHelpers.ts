import { CristinProject, ResearchProject } from '../../../../types/project.types';

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
});

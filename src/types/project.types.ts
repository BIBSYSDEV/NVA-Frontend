import { ProjectSearchParameter } from '../api/cristinApi';
import { CristinAggregationValue, LanguageString } from './common.types';
import { Organization } from './organization.types';
import { Funding } from './registration.types';

export interface TypedLabel {
  type: string;
  label: LanguageString;
}

export interface ResearchProject {
  type: 'ResearchProject';
  id: string;
  name: string;
  grants?: Grant[];
  approvals?: Approval[];
}

interface Grant {
  type: 'Grant';
  id: string;
  source: string;
}

interface Approval {
  type: 'Approval';
  applicationCode: string;
  approvedBy: string;
  approvalStatus: string;
  date: Date;
}

interface ProjectIdentifier {
  type: 'CristinIdentifier';
  value: string;
}

export type ProjectOrganization = Omit<Organization, 'partOf' | 'hasPart'>;

export interface ProjectContributorIdentity {
  type: 'Person';
  id: string;
  firstName: string;
  lastName: string;
}

export type ProjectContributorType = 'ProjectManager' | 'ProjectParticipant';

export interface ProjectContributor {
  type: ProjectContributorType;
  affiliation: ProjectOrganization;
  identity: ProjectContributorIdentity;
}

interface ProjectCreator extends Omit<ProjectContributor, 'type'> {
  type: 'ProjectCreator';
}

export interface ProjectFunding extends Pick<Funding, 'identifier' | 'source' | 'labels'> {
  type: 'UnconfirmedFunding';
}

export const emptyProjectFunding: ProjectFunding = {
  type: 'UnconfirmedFunding',
  identifier: '',
  source: '',
  labels: {},
};

export interface SaveCristinProject {
  type: 'Project';
  title: string;
  language: string;
  startDate: string;
  endDate: string;
  coordinatingInstitution: ProjectOrganization;
  contributors: ProjectContributor[];
  academicSummary: LanguageString;
  popularScientificSummary: LanguageString;
  projectCategories: TypedLabel[];
  keywords: TypedLabel[];
  relatedProjects: string[];
  funding: ProjectFunding[];
}

export interface CristinProject extends SaveCristinProject {
  id: string;
  identifier: ProjectIdentifier[];
  status: 'ACTIVE' | 'CONCLUDED' | 'NOTSTARTED';
  alternativeTitles: LanguageString[];
  coordinatingInstitution: ProjectOrganization;
  contributors: ProjectContributor[];
  created: {
    sourceShortName: 'REK' | 'NVA' | 'FORSKDOK';
  };
  creator?: ProjectCreator;
}

export interface ProjectAggegations {
  [ProjectSearchParameter.CategoryFacet]?: CristinAggregationValue;
  [ProjectSearchParameter.CoordinatingFacet]?: CristinAggregationValue;
  [ProjectSearchParameter.FundingSourceFacet]?: CristinAggregationValue;
  [ProjectSearchParameter.HealthProjectFacet]?: CristinAggregationValue;
  [ProjectSearchParameter.ParticipantFacet]?: CristinAggregationValue;
  [ProjectSearchParameter.ParticipantOrgFacet]?: CristinAggregationValue;
  [ProjectSearchParameter.ResponsibleFacet]?: CristinAggregationValue;
  [ProjectSearchParameter.SectorFacet]?: CristinAggregationValue;
}

export interface FundingSource {
  id: string;
  identifier: string;
  name: LanguageString;
}

export interface FundingSources {
  id: string;
  sources: FundingSource[];
}

export interface NfrProject {
  source: string;
  id: string;
  identifier: string;
  labels: LanguageString;
  lead: string;
  activeFrom: string;
  activeTo: string;
}

export const emptyProjectContributor: ProjectContributor = {
  type: 'ProjectParticipant',
  identity: { type: 'Person', id: '', firstName: '', lastName: '' },
  affiliation: { type: 'Organization', id: '', labels: {} },
};

export const emptyProject: SaveCristinProject = {
  type: 'Project',
  title: '',
  language: 'http://lexvo.org/id/iso639-3/nob',
  startDate: '',
  endDate: '',
  contributors: [{ ...emptyProjectContributor, type: 'ProjectManager' }],
  coordinatingInstitution: {
    type: 'Organization',
    id: '',
    labels: {},
  },
  academicSummary: {},
  popularScientificSummary: {},
  projectCategories: [],
  keywords: [],
  relatedProjects: [],
  funding: [],
};

import { ProjectSearchParameter } from '../api/cristinApi';
import { AggregationValue, LanguageString } from './common.types';
import { Organization } from './organization.types';
import { Funding } from './registration.types';

export enum ProjectTab {
  Description = 0,
  Details = 1,
  Contributors = 2,
  Connections = 3,
}

export interface TypedLabel {
  type: string;
  label: LanguageString;
}

export interface ResearchProject {
  type: 'ResearchProject';
  id: string;
  name: string;
  approvals?: Approval[];
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

export type ProjectOrganization = Omit<Organization, 'partOf' | 'hasPart' | 'acronym'>;

export type ProjectStatus = 'ACTIVE' | 'CONCLUDED' | 'NOTSTARTED';

export interface ProjectContributorIdentity {
  type: 'Person';
  id: string;
  firstName: string;
  lastName: string;
}

export type ProjectContributorType = 'ProjectManager' | 'ProjectParticipant';

export interface ProjectContributorRole {
  type: ProjectContributorType;
  affiliation: ProjectOrganization;
}

export interface ProjectContributor {
  identity: ProjectContributorIdentity;
  roles: ProjectContributorRole[];
}

interface CreatorRole extends Omit<ProjectContributorRole, 'type'> {
  type: 'ProjectCreator';
}

interface ProjectCreator extends Omit<ProjectContributor, 'roles'> {
  roles: [CreatorRole];
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
  identifiers: ProjectIdentifier[];
  status: ProjectStatus;
  alternativeTitles: LanguageString[];
  coordinatingInstitution: ProjectOrganization;
  contributors: ProjectContributor[];
  created: {
    sourceShortName: 'REK' | 'NVA' | 'FORSKDOK';
  };
  creator?: ProjectCreator;
}

export interface ProjectAggregations {
  [ProjectSearchParameter.CategoryFacet]?: AggregationValue[];
  [ProjectSearchParameter.CoordinatingFacet]?: AggregationValue[];
  [ProjectSearchParameter.FundingSourceFacet]?: AggregationValue[];
  [ProjectSearchParameter.HealthProjectFacet]?: AggregationValue[];
  [ProjectSearchParameter.ParticipantFacet]?: AggregationValue[];
  [ProjectSearchParameter.ParticipantOrgFacet]?: AggregationValue[];
  [ProjectSearchParameter.ResponsibleFacet]?: AggregationValue[];
  [ProjectSearchParameter.SectorFacet]?: AggregationValue[];
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

const emptyAffiliation: ProjectOrganization = {
  type: 'Organization',
  id: '',
  labels: {},
};

export const emptyProjectContributor: ProjectContributor = {
  identity: { type: 'Person', id: '', firstName: '', lastName: '' },
  roles: [{ type: 'ProjectParticipant', affiliation: emptyAffiliation }],
};

export const emptyProject: SaveCristinProject = {
  type: 'Project',
  title: '',
  language: 'http://lexvo.org/id/iso639-3/nob',
  startDate: '',
  endDate: '',
  contributors: [],
  coordinatingInstitution: emptyAffiliation,
  academicSummary: {},
  popularScientificSummary: {},
  projectCategories: [],
  keywords: [],
  relatedProjects: [],
  funding: [],
};

export enum ProjectFieldName {
  Title = 'title',
  Categories = 'projectCategories',
  CoordinatingInstitution = 'coordinatingInstitution',
  Contributors = 'contributors',
  Funding = 'funding',
  StartDate = 'startDate',
  EndDate = 'endDate',
  AcademicSummaryNo = 'academicSummary.no',
  PopularScientificSummaryNo = 'popularScientificSummary.no',
  AcademicSummaryEn = 'academicSummary.en',
  PopularScientificSummaryEn = 'popularScientificSummary.en',
  Keywords = 'keywords',
  RelatedProjects = 'relatedProjects',
  RoleType = 'roles[0].type',
  RoleAffiliation = 'roles[0].affiliation',
}

export enum ProjectContributorFieldName {
  Type = 'roles[0].type',
  Identity = 'identity',
  Roles = 'roles',
}

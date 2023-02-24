import { LanguageString } from './common.types';
import { Organization } from './organization.types';

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

interface Funding {
  source: {
    names: LanguageString;
    code: string;
  };
  code?: string;
}

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
}

export interface CristinProject extends SaveCristinProject {
  id: string;
  identifier: ProjectIdentifier[];
  status: 'ACTIVE' | 'CONCLUDED' | 'NOTSTARTED';
  alternativeTitles: LanguageString[];
  coordinatingInstitution: ProjectOrganization;
  contributors: ProjectContributor[];
  funding: Funding[];
}

interface FundingSource {
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
  affiliation: { type: 'Organization', id: '', name: {} },
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
    name: {},
  },
  academicSummary: {},
  popularScientificSummary: {},
  projectCategories: [],
};

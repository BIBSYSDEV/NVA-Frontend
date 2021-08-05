import { LanguageString } from './common.types';

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

type OrganizationType = 'Organization';

interface ProjectIdentifier {
  type: 'CristinIdentifier';
  value: string;
}

interface CoordinatingInstitution {
  type: OrganizationType;
  id: string;
  name: LanguageString;
}

interface ProjectContributor {
  type: 'ProjectManager' | 'ProjectParticipant';
  identity: {
    type: 'Person';
    id: string;
    firstName: string;
    lastName: string;
  };
  affiliation: {
    id: string;
    type: OrganizationType;
    name: LanguageString;
  };
}

export interface CristinProject {
  type: 'Project';
  id: string;
  identifier: ProjectIdentifier[];
  title: string;
  alternativeTitles: LanguageString[];
  language: string;
  startDate: string;
  endDate?: string;
  coordinatingInstitution: CoordinatingInstitution;
  contributors: ProjectContributor[];
}

export interface ProjectSearchResponse {
  id: string;
  size: number;
  searchString: string;
  processingTime: number;
  firstRecord: number;
  hits?: CristinProject[];
}

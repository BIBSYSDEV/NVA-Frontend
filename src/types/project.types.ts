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

interface ProjectIdentifier {
  type: 'CristinIdentifier';
  value: string;
}

interface BasicCoordinatingInstitution {
  type: 'Organization';
  id: string;
}

interface CoordinatingInstitution extends BasicCoordinatingInstitution {
  name: LanguageString;
}

interface BasicContributorAffiliation {
  type: 'Organization';
  id: string;
}

interface ContributorAffiliation extends BasicContributorAffiliation {
  name: LanguageString;
}

export interface BasicProjectContributor {
  type: 'ProjectManager' | 'ProjectParticipant';
  identity: {
    type: 'Person';
    id: string;
    firstName: string;
    lastName: string;
  };
  affiliation?: BasicContributorAffiliation;
}

export interface ProjectContributor extends BasicProjectContributor {
  affiliation?: ContributorAffiliation;
}

interface Funding {
  source: {
    names: LanguageString;
    code: string;
  };
  code: string;
}

export interface PostCristinProject {
  type: 'Project';
  title: string;
  language: string;
  startDate: string;
  endDate: string;
  coordinatingInstitution: BasicCoordinatingInstitution;
  contributors: BasicProjectContributor[];
  status: 'ACTIVE' | 'CONCLUDED' | 'NOTSTARTED'; // TODO: move to CristinProject
}

export interface CristinProject extends PostCristinProject {
  id: string;
  identifier: ProjectIdentifier[];
  alternativeTitles: LanguageString[];
  coordinatingInstitution: CoordinatingInstitution;
  contributors: ProjectContributor[];
  status: 'ACTIVE' | 'CONCLUDED' | 'NOTSTARTED';
  academicSummary: LanguageString;
  popularScientificSummary: LanguageString;
  funding: Funding[];
}

export interface ProjectSearchResponse {
  id: string;
  size: number;
  searchString: string;
  processingTime: number;
  firstRecord: number;
  hits?: CristinProject[];
}

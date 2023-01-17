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

interface BasicContributorIdentity {
  type: 'Person';
  id: string;
}

interface ContributorIdentity extends BasicContributorIdentity {
  firstName: string;
  lastName: string;
}

interface BasicProjectContributor {
  type: 'ProjectManager' | 'ProjectParticipant';
  identity: BasicContributorIdentity;
  affiliation?: BasicContributorAffiliation;
}

export interface ProjectContributor extends BasicProjectContributor {
  affiliation?: ContributorAffiliation;
  identity: ContributorIdentity;
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
}

export interface CristinProject extends PostCristinProject {
  id: string;
  identifier: ProjectIdentifier[];
  status: 'ACTIVE' | 'CONCLUDED' | 'NOTSTARTED';
  alternativeTitles: LanguageString[];
  coordinatingInstitution: CoordinatingInstitution;
  contributors: ProjectContributor[];
  academicSummary: LanguageString;
  popularScientificSummary: LanguageString;
  funding: Funding[];
}

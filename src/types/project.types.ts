import { LanguageString } from './publication_types/commonRegistration.types';
import { BackendType } from './registration.types';

export interface ResearchProject extends BackendType {
  id: string;
  name: string;
  grants?: Grant[];
  approvals?: Approval[];
}

interface Grant extends BackendType {
  id: string;
  source: string;
}

interface Approval extends BackendType {
  applicationCode: string;
  approvedBy: string;
  approvalStatus: string;
  date: Date;
}

type ProjectIdentifierType = 'CristinIdentifier';
type ProjectContributorType = 'ProjectManager' | 'ProjectParticipant';
type OrganizationType = 'Organization';
type PersonType = 'Person';
type ProjectType = 'Project';

interface ProjectIdentifier {
  type: ProjectIdentifierType;
  value: string;
}

interface CoordinatingInstitution {
  id: string;
  type: OrganizationType;
  name: LanguageString;
}

interface ProjectContributor {
  type: ProjectContributorType;
  identity: {
    id: string;
    type: PersonType;
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
  id: string;
  type: ProjectType;
  identifier: ProjectIdentifier[];
  title: string;
  alternativeTitles: LanguageString[];
  language: string;
  startDate: string;
  endDate: string;
  coordinatingInstitution: CoordinatingInstitution;
  contributors: ProjectContributor[];
}

export interface ProjectSearchResponse {
  id: string;
  size: number;
  searchString: string;
  processingTime: number;
  firstRecord: number;
  hits: CristinProject[];
}

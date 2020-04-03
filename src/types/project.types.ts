export interface Project {
  id: string;
  name: string;
  grants?: Grant[];
  approvals?: Approval[];
}

interface Grant {
  id: string;
  source: string;
}

interface Approval {
  applicationCode: string;
  approvedBy: string;
  approvalStatus: string;
  date: Date;
}

export interface CristinProject {
  cristinProjectId: string;
  mainLanguage: string;
  titles: CristinProjectTitle[];
  participants: CristinProjectParticipant[];
  institutions: CristinProjectInstitution[];
  fundings: CristinProjectFunding[];
}

interface CristinProjectTitle {
  title: string;
  language: string;
}

interface CristinProjectParticipant {
  cristinPersonId: string;
  fullName: string;
}

interface CristinProjectInstitution {
  cristinInstitutionId: string;
  name: string;
  language: string;
}

export interface CristinProjectFunding {
  fundingSourceCode: string;
  projectCode: string;
}

export interface Project {
  cristinProjectId: string;
  mainLanguage: string;
  titles: ProjectTitle[];
  participants: ProjectParticipant[];
  institutions: ProjectInstitution[];
  fundings: ProjectFundings[];
}

interface ProjectTitle {
  title: string;
  language: string;
}

interface ProjectParticipant {
  cristinPersonId: string;
  fullName: string;
}

interface ProjectInstitution {
  cristinInstitutionId: string;
  name: string;
  language: string;
}

interface ProjectFundings {
  fundingSourceCode: string;
  projectCode: string;
}

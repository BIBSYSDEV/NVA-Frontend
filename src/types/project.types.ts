export interface Project {
  cristinProjectId: string;
  mainLanguage: string;
  titles: [ProjectTitle];
  participants: [ProjectParticipant];
  institutions: [ProjectInstitution];
  fundings: [ProjectFundings];
}

export interface ProjectTitle {
  title: string;
  language: string;
}

export interface ProjectParticipant {
  cristinPersonId: string;
  fullName: string;
}

export interface ProjectInstitution {
  cristinInstitutionId: string;
  name: string;
  language: string;
}

export interface ProjectFundings {
  fundingSourceCode: string;
  projectCode: string;
}

export const emptyProject = {
  cristinProjectId: '',
  mainLanguage: '',
  titles: [],
  participants: [],
  institutions: [],
  fundings: [],
};

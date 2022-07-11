import { LanguageString } from './common.types';

// For available roles, see https://github.com/BIBSYSDEV/nva-datamodel-java/blob/develop/src/main/java/no/unit/nva/model/Role.java
export enum ContributorRole {
  Architect = 'Architect',
  ArchitecturalPlanner = 'ArchitecturalPlanner',
  Consultant = 'Consultant',
  ContactPerson = 'ContactPerson',
  Creator = 'Creator',
  CuratorOrganizer = 'CuratorOrganizer',
  Designer = 'Designer',
  Editor = 'Editor',
  InteriorArchitect = 'InteriorArchitect',
  LandscapeArchitect = 'LandscapeArchitect',
  Other = 'Other',
  Producer = 'Producer',
  RelatedPerson = 'RelatedPerson',
  Researcher = 'Researcher',
  RightsHolder = 'RightsHolder',
  Supervisor = 'Supervisor',
}

export interface Identity {
  type: 'Identity';
  id?: string;
  name: string;
  orcId?: string;
}

export interface Contributor {
  type: 'Contributor';
  affiliations?: Institution[];
  correspondingAuthor?: boolean;
  identity: Identity;
  role: ContributorRole;
  sequence: number;
}

// DOI lookup can give labels without id for institutions,
// while when a contributor is added manually there will be ids present, and no need for labels.
export interface Institution {
  type: 'Organization';
  id?: string;
  labels?: LanguageString;
}

export const emptyContributor: Contributor = {
  affiliations: [],
  correspondingAuthor: false,
  identity: {
    type: 'Identity',
    name: '',
  },
  role: ContributorRole.Creator,
  sequence: 0,
  type: 'Contributor',
};

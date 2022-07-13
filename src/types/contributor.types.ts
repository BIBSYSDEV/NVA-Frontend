import { LanguageString } from './common.types';

// For available roles, see https://github.com/BIBSYSDEV/nva-datamodel-java/blob/develop/src/main/java/no/unit/nva/model/Role.java
export enum ContributorRole {
  Actor = 'Actor',
  Architect = 'Architect',
  ArchitecturalPlanner = 'ArchitecturalPlanner',
  ArtisticDirector = 'ArtisticDirector',
  Choreographer = 'Choreographer',
  Consultant = 'Consultant',
  ContactPerson = 'ContactPerson', // TODO: not needed?
  CostumeDesigner = 'CostumeDesigner',
  Creator = 'Creator',
  CuratorOrganizer = 'CuratorOrganizer',
  Dancer = 'Dancer',
  Designer = 'Designer',
  Director = 'Director',
  Dramatist = 'Dramatist',
  Dramaturge = 'Dramaturge',
  Editor = 'Editor',
  InteriorArchitect = 'InteriorArchitect',
  LandscapeArchitect = 'LandscapeArchitect',
  Librettist = 'Librettist',
  LightDesigner = 'LightDesigner',
  Other = 'Other',
  Photographer = 'Photographer',
  ProductionDesigner = 'ProductionDesigner',
  Producer = 'Producer',
  RelatedPerson = 'RelatedPerson', // TODO: not needed?
  Researcher = 'Researcher', // TODO: not needed?
  RightsHolder = 'RightsHolder', // TODO: not needed?
  Scenographer = 'Scenographer',
  Screenwriter = 'Screenwriter',
  SoundDesigner = 'SoundDesigner',
  Supervisor = 'Supervisor',
  VfxSupervisor = 'VfxSupervisor',
  VideoEditor = 'VideoEditor',
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

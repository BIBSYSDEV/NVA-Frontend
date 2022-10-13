import { LanguageString } from './common.types';

// For available roles, see https://github.com/BIBSYSDEV/nva-datamodel-java/blob/main/nva-datamodel-java/src/main/java/no/unit/nva/model/Role.java
export enum ContributorRole {
  AcademicCoordinator = 'AcademicCoordinator',
  Actor = 'Actor',
  Architect = 'Architect',
  ArchitecturalPlanner = 'ArchitecturalPlanner',
  ArtisticDirector = 'ArtisticDirector',
  Choreographer = 'Choreographer',
  Composer = 'Composer',
  Conductor = 'Conductor',
  Consultant = 'Consultant',
  ContactPerson = 'ContactPerson',
  CostumeDesigner = 'CostumeDesigner',
  Creator = 'Creator',
  CuratorOrganizer = 'CuratorOrganizer',
  DataCollector = 'DataCollector',
  DataCurator = 'DataCurator',
  DataManager = 'DataManager',
  Dancer = 'Dancer',
  Designer = 'Designer',
  Distributor = 'Distributor',
  Director = 'Director',
  Dramatist = 'Dramatist',
  Dramaturge = 'Dramaturge',
  Editor = 'Editor',
  InteriorArchitect = 'InteriorArchitect',
  InterviewSubject = 'InterviewSubject',
  Journalist = 'Journalist',
  LandscapeArchitect = 'LandscapeArchitect',
  Librettist = 'Librettist',
  LightDesigner = 'LightDesigner',
  Musician = 'Musician',
  Organizer = 'Organizer',
  Other = 'Other',
  Photographer = 'Photographer',
  ProductionDesigner = 'ProductionDesigner',
  Producer = 'Producer',
  ProgrammeLeader = 'ProgrammeLeader',
  ProgrammeParticipant = 'ProgrammeParticipant',
  RelatedPerson = 'RelatedPerson',
  Researcher = 'Researcher',
  RightsHolder = 'RightsHolder',
  Scenographer = 'Scenographer',
  Screenwriter = 'Screenwriter',
  Soloist = 'Soloist',
  SoundDesigner = 'SoundDesigner',
  Supervisor = 'Supervisor',
  VfxSupervisor = 'VfxSupervisor',
  VideoEditor = 'VideoEditor',
  Writer = 'Writer',
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

import { UnconfirmedOrganization } from './common.types';
import { Organization } from './organization.types';

// For available roles, see https://github.com/BIBSYSDEV/nva-datamodel-java/blob/main/nva-datamodel-java/src/main/java/no/unit/nva/model/Role.java
export enum ContributorRole {
  AcademicCoordinator = 'AcademicCoordinator',
  Actor = 'Actor',
  Architect = 'Architect',
  ArchitecturalPlanner = 'ArchitecturalPlanner',
  Artist = 'Artist',
  ArtisticDirector = 'ArtisticDirector',
  AudioVisualContributor = 'AudioVisualContributor',
  Choreographer = 'Choreographer',
  CollaborationPartner = 'CollaborationPartner',
  Composer = 'Composer',
  Conductor = 'Conductor',
  Conservator = 'Conservator',
  Consultant = 'Consultant',
  ContactPerson = 'ContactPerson',
  CostumeDesigner = 'CostumeDesigner',
  Creator = 'Creator',
  Curator = 'Curator',
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
  ExhibitionDesigner = 'ExhibitionDesigner',
  InteriorArchitect = 'InteriorArchitect',
  InterviewSubject = 'InterviewSubject',
  Journalist = 'Journalist',
  LandscapeArchitect = 'LandscapeArchitect',
  Librettist = 'Librettist',
  LightDesigner = 'LightDesigner',
  MuseumEducator = 'MuseumEducator',
  Musician = 'Musician',
  Organizer = 'Organizer',
  Other = 'RoleOther',
  Photographer = 'Photographer',
  ProductionDesigner = 'ProductionDesigner',
  Producer = 'Producer',
  ProgrammeLeader = 'ProgrammeLeader',
  ProgrammeParticipant = 'ProgrammeParticipant',
  ProjectLeader = 'ProjectLeader',
  Registrar = 'Registrar',
  RelatedPerson = 'RelatedPerson',
  Researcher = 'Researcher',
  RightsHolder = 'RightsHolder',
  Scenographer = 'Scenographer',
  Screenwriter = 'Screenwriter',
  Soloist = 'Soloist',
  SoundDesigner = 'SoundDesigner',
  Supervisor = 'Supervisor',
  TranslatorAdapter = 'TranslatorAdapter',
  VfxSupervisor = 'VfxSupervisor',
  VideoEditor = 'VideoEditor',
  Writer = 'Writer',
}

export enum VerificationStatus {
  Verified = 'Verified',
  NotVerified = 'NotVerified',
  CannotBeEstablished = 'CannotBeEstablished',
}

export interface Identity {
  type: 'Identity';
  id?: string;
  name: string;
  orcId?: string;
  additionalIdentifiers?: AdditionalIdentifier[];
  verificationStatus?: VerificationStatus;
}

interface AdditionalIdentifier {
  sourceName: string;
  value: string;
}

export interface Contributor {
  type: 'Contributor';
  affiliations?: Affiliation[];
  correspondingAuthor?: boolean;
  identity: Identity;
  role: {
    type: ContributorRole;
    description?: string;
  };
  sequence: number;
}

export interface PreviewContributor {
  affiliations?: Affiliation[];
  correspondingAuthor?: boolean;
  identity: Identity;
  role: ContributorRole;
}

export type ConfirmedAffiliation = Pick<Organization, 'type' | 'id'>;

export type Affiliation = ConfirmedAffiliation | UnconfirmedOrganization;

export const emptyContributor: Contributor = {
  affiliations: [],
  correspondingAuthor: false,
  identity: {
    type: 'Identity',
    name: '',
    verificationStatus: VerificationStatus.NotVerified,
  },
  role: { type: ContributorRole.Creator },
  sequence: 0,
  type: 'Contributor',
};

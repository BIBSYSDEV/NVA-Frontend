import { OutputItem } from '../pages/registration/resource_type_tab/sub_type_forms/artistic_types/OutputRow';
import i18n from '../translations/i18n';
import { AssociatedArtifact, AssociatedFile, AssociatedLink } from '../types/associatedArtifact.types';
import { Contributor, ContributorRole } from '../types/contributor.types';
import {
  ArtisticType,
  BookType,
  ChapterType,
  DegreeType,
  ExhibitionContentType,
  JournalType,
  MediaType,
  OtherRegistrationType,
  PresentationType,
  PublicationType,
  ReportType,
  ResearchDataType,
} from '../types/publicationFieldNames';
import {
  AudioVisualPublication,
  Award,
  Broadcast,
  CinematicRelease,
  Competition,
  Concert,
  Exhibition,
  LiteraryArtsAudioVisual,
  LiteraryArtsMonograph,
  LiteraryArtsPerformance,
  LiteraryArtsWeb,
  MentionInPublication,
  MusicScore,
  OtherMusicPerformance,
  OtherRelease,
  Venue,
} from '../types/publication_types/artisticRegistration.types';
import {
  ExhibitionBasic,
  ExhibitionMentionInPublication,
  ExhibitionOtherPresentation,
} from '../types/publication_types/exhibitionContent.types';
import { JournalRegistration } from '../types/publication_types/journalRegistration.types';
import { PresentationRegistration } from '../types/publication_types/presentationRegistration.types';
import {
  Journal,
  PublicationInstanceType,
  Publisher,
  Registration,
  RegistrationStatus,
  Series,
} from '../types/registration.types';
import { User } from '../types/user.types';

export const getMainRegistrationType = (instanceType: string) =>
  isJournal(instanceType)
    ? PublicationType.PublicationInJournal
    : isBook(instanceType)
      ? PublicationType.Book
      : isDegree(instanceType)
        ? PublicationType.Degree
        : isReport(instanceType)
          ? PublicationType.Report
          : isChapter(instanceType)
            ? PublicationType.Anthology
            : isPresentation(instanceType)
              ? PublicationType.Presentation
              : isArtistic(instanceType)
                ? PublicationType.Artistic
                : isMediaContribution(instanceType)
                  ? PublicationType.MediaContribution
                  : isResearchData(instanceType)
                    ? PublicationType.ResearchData
                    : isExhibitionContent(instanceType)
                      ? PublicationType.ExhibitionContent
                      : isOtherRegistration(instanceType)
                        ? PublicationType.GeographicalContent
                        : '';

export const isJournal = (instanceType: any) => Object.values(JournalType).includes(instanceType);

export const isBook = (instanceType: any) => Object.values(BookType).includes(instanceType);

export const isDegree = (instanceType: any) => Object.values(DegreeType).includes(instanceType);

export const isDegreeWithProtectedFiles = (instanceType: any) =>
  instanceType === DegreeType.Bachelor ||
  instanceType === DegreeType.Master ||
  instanceType === DegreeType.Phd ||
  instanceType === DegreeType.Other;

export const isReport = (instanceType: any) => Object.values(ReportType).includes(instanceType);

export const isChapter = (instanceType: any) => Object.values(ChapterType).includes(instanceType);

export const isPresentation = (instanceType: any) => Object.values(PresentationType).includes(instanceType);

export const isArtistic = (instanceType: any) => Object.values(ArtisticType).includes(instanceType);

export const isMediaContribution = (instanceType: any) => Object.values(MediaType).includes(instanceType);

export const isResearchData = (instanceType: any) => Object.values(ResearchDataType).includes(instanceType);

export const isPeriodicalMediaContribution = (instanceType: string) =>
  instanceType === MediaType.MediaFeatureArticle || instanceType === MediaType.MediaReaderOpinion;

export const isOtherRegistration = (instanceType: any) => Object.values(OtherRegistrationType).includes(instanceType);

export const isExhibitionContent = (instanceType: any) => Object.values(ExhibitionContentType).includes(instanceType);

export const nviApplicableTypes: string[] = [
  JournalType.AcademicArticle,
  JournalType.AcademicLiteratureReview,
  BookType.AcademicMonograph,
  ChapterType.AcademicChapter,
];

export const userIsRegistrationOwner = (user: User | null, registration?: Registration) =>
  !!user && !!registration && user.isCreator && user.nvaUsername === registration.resourceOwner.owner;

export const userIsRegistrationCurator = (user: User | null, registration?: Registration) =>
  !!user && !!registration && user.isCurator && !!user.customerId && user.customerId === registration.publisher.id;

export const userIsValidImporter = (user: User | null, registration?: Registration) =>
  !!user && !!registration && user.isInternalImporter && registration.type === 'ImportCandidate';

export const getYearQuery = (yearValue: string) =>
  yearValue && Number.isInteger(Number(yearValue)) ? yearValue : new Date().getFullYear().toString();

const getPublicationChannelIssnString = (onlineIssn?: string | null, printIssn?: string | null) => {
  const issnString =
    printIssn || onlineIssn
      ? [
          printIssn ? `${i18n.t('registration.resource_type.print_issn')}: ${printIssn}` : '',
          onlineIssn ? `${i18n.t('registration.resource_type.online_issn')}: ${onlineIssn}` : '',
        ]
          .filter((issn) => issn)
          .join(', ')
      : '';
  return issnString;
};

export const getPublicationChannelString = (publicationChannel: Journal | Series | Publisher) => {
  if (publicationChannel.type === 'Publisher') {
    return publicationChannel.name;
  } else {
    const issnString = getPublicationChannelIssnString(publicationChannel.onlineIssn, publicationChannel.printIssn);
    return issnString ? `${publicationChannel.name} (${issnString})` : publicationChannel.name;
  }
};

// Ensure Registration has correct type values, etc
export const getFormattedRegistration = (registration: Registration) => {
  const type = registration.entityDescription?.reference?.publicationInstance?.type ?? '';
  let formattedRegistration = registration;

  if (formattedRegistration.entityDescription && !formattedRegistration.entityDescription.type) {
    formattedRegistration.entityDescription.type = 'EntityDescription';
  }
  if (formattedRegistration.entityDescription?.reference && !formattedRegistration.entityDescription.reference.type) {
    formattedRegistration.entityDescription.reference.type = 'Reference';
  }

  if (isJournal(type)) {
    const journalRegistration = formattedRegistration as JournalRegistration;
    if (journalRegistration.entityDescription.reference) {
      const { pages } = journalRegistration.entityDescription.reference.publicationInstance;

      formattedRegistration = {
        ...journalRegistration,
        entityDescription: {
          ...journalRegistration.entityDescription,
          reference: {
            ...journalRegistration.entityDescription.reference,
            publicationInstance: {
              ...journalRegistration.entityDescription.reference.publicationInstance,
              pages: pages ? { ...pages, type: 'Range' } : null,
            },
          },
        },
      };
    }
  } else if (isPresentation(type)) {
    const presentationRegistration = formattedRegistration as PresentationRegistration;
    const { time, agent, place } = presentationRegistration.entityDescription.reference.publicationContext;

    formattedRegistration = {
      ...presentationRegistration,
      entityDescription: {
        ...presentationRegistration.entityDescription,
        reference: {
          ...presentationRegistration.entityDescription.reference,
          publicationContext: {
            ...presentationRegistration.entityDescription.reference.publicationContext,
            time: time?.from && time.to ? { ...time, type: 'Period' } : null,
            agent: agent?.name ? { ...agent, type: 'UnconfirmedOrganization' } : null,
            place: place?.label || place?.country ? { ...place, type: 'UnconfirmedPlace' } : null,
          },
        },
      },
    };
  }

  return formattedRegistration;
};

type ContributorConfig = {
  [type in PublicationInstanceType]: { primaryRoles: ContributorRole[]; secondaryRoles: ContributorRole[] };
};

export const contributorConfig: ContributorConfig = {
  // Journal
  [JournalType.AcademicArticle]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [JournalType.AcademicLiteratureReview]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [JournalType.Letter]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [JournalType.Review]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [JournalType.Leader]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [JournalType.Corrigendum]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [JournalType.Issue]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [JournalType.ConferenceAbstract]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [JournalType.CaseReport]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [JournalType.StudyProtocol]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [JournalType.ProfessionalArticle]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [JournalType.PopularScienceArticle]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  // Book
  [BookType.AcademicMonograph]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [BookType.NonFictionMonograph]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [BookType.PopularScienceMonograph]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [BookType.Textbook]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [BookType.Encyclopedia]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [BookType.ExhibitionCatalog]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [BookType.Anthology]: {
    primaryRoles: [ContributorRole.Editor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  // Report
  [ReportType.Research]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [ReportType.Policy]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [ReportType.WorkingPaper]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [ReportType.BookOfAbstracts]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [ReportType.ConferenceReport]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [ReportType.Report]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  // Degree
  [DegreeType.Bachelor]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Supervisor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [DegreeType.Master]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Supervisor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [DegreeType.Phd]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Supervisor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [DegreeType.Licentiate]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Supervisor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [DegreeType.Other]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Supervisor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  // Chapter
  [ChapterType.AcademicChapter]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [ChapterType.NonFictionChapter]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [ChapterType.PopularScienceChapter]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [ChapterType.TextbookChapter]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [ChapterType.EncyclopediaChapter]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [ChapterType.Introduction]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [ChapterType.ExhibitionCatalogChapter]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [ChapterType.ReportChapter]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [ChapterType.ConferenceAbstract]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  // Presentation
  [PresentationType.ConferenceLecture]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [PresentationType.ConferencePoster]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [PresentationType.Lecture]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [PresentationType.OtherPresentation]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  // Artistic
  [ArtisticType.ArtisticDesign]: {
    primaryRoles: [
      ContributorRole.Designer,
      ContributorRole.CuratorOrganizer,
      ContributorRole.Consultant,
      ContributorRole.Other,
    ],
    secondaryRoles: [],
  },
  [ArtisticType.ArtisticArchitecture]: {
    primaryRoles: [
      ContributorRole.Architect,
      ContributorRole.LandscapeArchitect,
      ContributorRole.InteriorArchitect,
      ContributorRole.ArchitecturalPlanner,
      ContributorRole.Other,
    ],
    secondaryRoles: [],
  },
  [ArtisticType.PerformingArts]: {
    primaryRoles: [
      ContributorRole.Dancer,
      ContributorRole.Actor,
      ContributorRole.Choreographer,
      ContributorRole.Director,
      ContributorRole.Scenographer,
      ContributorRole.CostumeDesigner,
      ContributorRole.Producer,
      ContributorRole.ArtisticDirector,
      ContributorRole.Dramatist,
      ContributorRole.Librettist,
      ContributorRole.Dramaturge,
      ContributorRole.SoundDesigner,
      ContributorRole.LightDesigner,
      ContributorRole.Other,
    ],
    secondaryRoles: [],
  },
  [ArtisticType.MovingPicture]: {
    primaryRoles: [
      ContributorRole.Director,
      ContributorRole.Photographer,
      ContributorRole.Producer,
      ContributorRole.ProductionDesigner,
      ContributorRole.Screenwriter,
      ContributorRole.SoundDesigner,
      ContributorRole.VfxSupervisor,
      ContributorRole.VideoEditor,
    ],
    secondaryRoles: [ContributorRole.Other],
  },
  [ArtisticType.MusicPerformance]: {
    primaryRoles: [
      ContributorRole.Soloist,
      ContributorRole.Conductor,
      ContributorRole.Musician,
      ContributorRole.Composer,
      ContributorRole.Organizer,
      ContributorRole.Writer,
      ContributorRole.Other,
    ],
    secondaryRoles: [],
  },
  [ArtisticType.VisualArts]: {
    primaryRoles: [ContributorRole.Artist, ContributorRole.Curator, ContributorRole.Consultant, ContributorRole.Other],
    secondaryRoles: [],
  },
  [ArtisticType.LiteraryArts]: {
    primaryRoles: [
      ContributorRole.Creator,
      ContributorRole.TranslatorAdapter,
      ContributorRole.Editor,
      ContributorRole.Other,
    ],
    secondaryRoles: [],
  },
  // Media
  [MediaType.MediaFeatureArticle]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Other],
    secondaryRoles: [],
  },
  [MediaType.MediaReaderOpinion]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Other],
    secondaryRoles: [],
  },
  [MediaType.MediaInterview]: {
    primaryRoles: [ContributorRole.Journalist, ContributorRole.InterviewSubject, ContributorRole.Other],
    secondaryRoles: [],
  },
  [MediaType.MediaBlogPost]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Other],
    secondaryRoles: [],
  },
  [MediaType.MediaPodcast]: {
    primaryRoles: [ContributorRole.ProgrammeLeader, ContributorRole.ProgrammeParticipant, ContributorRole.Other],
    secondaryRoles: [],
  },
  [MediaType.MediaParticipationInRadioOrTv]: {
    primaryRoles: [ContributorRole.ProgrammeLeader, ContributorRole.ProgrammeParticipant, ContributorRole.Other],
    secondaryRoles: [],
  },
  // ResearchData
  [ResearchDataType.DataManagementPlan]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [
      ContributorRole.DataCollector,
      ContributorRole.DataCurator,
      ContributorRole.DataManager,
      ContributorRole.Distributor,
      ContributorRole.ContactPerson,
      ContributorRole.Editor,
      ContributorRole.RelatedPerson,
      ContributorRole.Researcher,
      ContributorRole.RightsHolder,
      ContributorRole.Supervisor,
      ContributorRole.Other,
    ],
  },
  [ResearchDataType.Dataset]: {
    primaryRoles: [
      ContributorRole.DataCollector,
      ContributorRole.DataCurator,
      ContributorRole.DataManager,
      ContributorRole.Distributor,
      ContributorRole.ContactPerson,
      ContributorRole.Editor,
      ContributorRole.RelatedPerson,
      ContributorRole.Researcher,
      ContributorRole.RightsHolder,
      ContributorRole.Supervisor,
      ContributorRole.Other,
    ],
    secondaryRoles: [],
  },
  // Exhibition
  [ExhibitionContentType.ExhibitionProduction]: {
    primaryRoles: [
      ContributorRole.ProjectLeader,
      ContributorRole.Curator,
      ContributorRole.Conservator,
      ContributorRole.Registrar,
      ContributorRole.MuseumEducator,
      ContributorRole.CollaborationPartner,
      ContributorRole.ExhibitionDesigner,
      ContributorRole.Designer,
      ContributorRole.Writer,
      ContributorRole.Photographer,
      ContributorRole.AudioVisualContributor,
      ContributorRole.Other,
    ],
    secondaryRoles: [],
  },
  // Other
  [OtherRegistrationType.Map]: {
    primaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
    secondaryRoles: [],
  },
};

export const groupContributors = (contributors: Contributor[], registrationType: PublicationInstanceType) => {
  const { primaryRoles, secondaryRoles } = contributorConfig[registrationType];
  const primaryContributors = contributors.filter((contributor) => primaryRoles.includes(contributor.role.type));
  const secondaryContributors = contributors.filter((contributor) => secondaryRoles.includes(contributor.role.type));

  return { primaryContributors, secondaryContributors };
};

export const getOutputName = (item: OutputItem): string => {
  switch (item.type) {
    case 'Venue':
    case 'PerformingArtsVenue':
      return (item as Venue).place?.label ?? '';
    case 'Competition':
      return (item as Competition).name;
    case 'MentionInPublication':
      return (item as MentionInPublication).title;
    case 'Award':
      return (item as Award).name;
    case 'Exhibition':
      return (item as Exhibition).name;
    case 'Broadcast':
      return (item as Broadcast).publisher.name;
    case 'CinematicRelease':
      return (item as CinematicRelease).place.label;
    case 'OtherRelease': {
      const otherRelease = item as OtherRelease;
      return [otherRelease.publisher.name, otherRelease.place.label].filter(Boolean).join('/');
    }
    case 'MusicScore':
      return (item as MusicScore).publisher.name;
    case 'AudioVisualPublication':
      return (item as AudioVisualPublication).publisher.name;
    case 'Concert':
      return (item as Concert).place.label;
    case 'OtherPerformance': {
      const otherMusicPerformance = item as OtherMusicPerformance;
      return otherMusicPerformance.place.label
        ? otherMusicPerformance.place.label
        : otherMusicPerformance.performanceType;
    }
    case 'LiteraryArtsMonograph':
      return (item as LiteraryArtsMonograph).publisher.name;
    case 'LiteraryArtsPerformance':
      return (item as LiteraryArtsPerformance).place.label;
    case 'LiteraryArtsAudioVisual':
      return (item as LiteraryArtsAudioVisual).publisher.name;
    case 'LiteraryArtsWeb':
      return (item as LiteraryArtsWeb).publisher.name;
    case 'ExhibitionBasic':
      return (item as ExhibitionBasic).organization.name;
    case 'ExhibitionOtherPresentation':
      return (item as ExhibitionOtherPresentation).typeDescription;
    case 'ExhibitionMentionInPublication':
      return (item as ExhibitionMentionInPublication).title;
    default:
      return '';
  }
};

const userIsContributorOnPublishedRegistration = (user: User | null, registration: Registration) =>
  !!user?.isCreator &&
  !!user.cristinId &&
  (registration.status === RegistrationStatus.Published ||
    registration.status === RegistrationStatus.PublishedMetadata) &&
  !!registration.entityDescription?.contributors.some((contributor) => contributor.identity.id === user.cristinId);

export const userCanEditRegistration = (user: User | null, registration: Registration) => {
  if (!user) {
    return false;
  }

  const isValidCurator = userIsRegistrationCurator(user, registration);
  if (isDegreeWithProtectedFiles(registration.entityDescription?.reference?.publicationInstance?.type)) {
    return isValidCurator && user.isThesisCurator;
  }

  return (
    isValidCurator ||
    userIsRegistrationOwner(user, registration) ||
    userIsContributorOnPublishedRegistration(user, registration) ||
    user.isEditor
  );
};

export const hyphenateIsrc = (isrc: string) =>
  isrc ? `${isrc.substring(0, 2)}-${isrc.substring(2, 5)}-${isrc.substring(5, 7)}-${isrc.substring(7, 12)}` : '';

export const getTitleString = (title: string | undefined) => title || `[${i18n.t('registration.missing_title')}]`;

export const associatedArtifactIsFile = ({ type }: { type: string }) =>
  type === 'File' || type === 'UnpublishedFile' || type === 'PublishedFile' || type === 'UnpublishableFile';

export const associatedArtifactIsLink = ({ type }: { type: string }) => type === 'AssociatedLink';

export const associatedArtifactIsNullArtifact = ({ type }: { type: string }) => type === 'NullAssociatedArtifact';

export const getAssociatedFiles = (associatedArtifacts: AssociatedArtifact[]) =>
  associatedArtifacts.filter(associatedArtifactIsFile) as AssociatedFile[];

export const getAssociatedLinks = (associatedArtifacts: AssociatedArtifact[]) =>
  associatedArtifacts.filter(associatedArtifactIsLink) as AssociatedLink[];

export const getContributorInitials = (name: string) => {
  if (!name) return '';

  const splittedNames = name.split(' ');
  const firstNameInitial = splittedNames[0][0];
  const lastNameInitial = splittedNames.length > 1 ? splittedNames.pop()?.[0] : '';
  const initials = `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  return initials;
};

export const isTypeWithFileVersionField = (publicationInstanceType?: string) =>
  publicationInstanceType === JournalType.AcademicArticle ||
  publicationInstanceType === JournalType.AcademicLiteratureReview;

export const isEmbargoed = (embargoDate: Date | null) => {
  if (!embargoDate) {
    return false;
  }
  return new Date(embargoDate) > new Date();
};

export const openFileInNewTab = (fileUri: string) => {
  if (fileUri) {
    // Use timeout to ensure that file is opened on Safari/iOS: NP-30205, https://stackoverflow.com/a/70463940
    setTimeout(() => window.open(fileUri, '_blank'));
  }
};

export const compareRegistrationAndValues = (registration: Registration, values: Registration) => {
  return registration.entityDescription?.mainTitle !== values.entityDescription?.mainTitle ? true : false;
};

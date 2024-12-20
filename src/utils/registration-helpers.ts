import { t, TFunction } from 'i18next';
import { getLanguageByIso6393Code } from 'nva-language';
import { DisabledCategory } from '../components/CategorySelector';
import { OutputItem } from '../pages/registration/resource_type_tab/sub_type_forms/artistic_types/OutputRow';
import i18n from '../translations/i18n';
import { AssociatedArtifact, AssociatedFile, AssociatedLink, FileType } from '../types/associatedArtifact.types';
import { Contributor, ContributorRole, PreviewContributor } from '../types/contributor.types';
import { CustomerInstitution } from '../types/customerInstitution.types';
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
import { DegreeRegistration } from '../types/publication_types/degreeRegistration.types';
import { ExhibitionBasic } from '../types/publication_types/exhibitionContent.types';
import { JournalRegistration } from '../types/publication_types/journalRegistration.types';
import { PresentationRegistration } from '../types/publication_types/presentationRegistration.types';
import {
  allPublicationInstanceTypes,
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
  ContextSeries,
  NpiSubjectDomain,
  PublicationInstanceType,
  Publisher,
  Registration,
  RegistrationOperation,
  RegistrationSearchItem,
  RelatedDocument,
  SerialPublication,
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

export const nviApplicableTypes: PublicationInstanceType[] = [
  JournalType.AcademicArticle,
  JournalType.AcademicLiteratureReview,
  BookType.AcademicMonograph,
  BookType.AcademicCommentary,
  ChapterType.AcademicChapter,
];

export const userIsValidImporter = (user: User | null, registration?: Registration) =>
  !!user && !!registration && user.isInternalImporter && registration.type === 'ImportCandidate';

export const getYearQuery = (yearValue: string) =>
  yearValue && Number.isInteger(Number(yearValue)) ? yearValue : new Date().getFullYear().toString();

const getChannelMetadataString = (discontinued?: string, onlineIssn?: string | null, printIssn?: string | null) => {
  const metadataString =
    discontinued || printIssn || onlineIssn
      ? [
          discontinued ? `${i18n.t('common.discontinued')}: ${discontinued}` : '',
          printIssn ? `${i18n.t('registration.resource_type.print_issn')}: ${printIssn}` : '',
          onlineIssn ? `${i18n.t('registration.resource_type.online_issn')}: ${onlineIssn}` : '',
        ]
          .filter(Boolean)
          .join(', ')
      : '';
  return metadataString;
};

export const getPublicationChannelString = (channel: SerialPublication | SerialPublication | Publisher) => {
  const channelMetadata = getChannelMetadataString(channel.discontinued, channel.onlineIssn, channel.printIssn);
  return channelMetadata ? `${channel.name} (${channelMetadata})` : channel.name;
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
            time: time?.from || time?.to ? { ...time, type: 'Period' } : null,
            agent: agent?.name ? { ...agent, type: 'UnconfirmedOrganization' } : null,
            place: place?.name || place?.country ? { ...place, type: 'UnconfirmedPlace' } : null,
          },
        },
      },
    };
  } else if (isDegree(type)) {
    const degreeRegistration = formattedRegistration as DegreeRegistration;
    const { course } = degreeRegistration.entityDescription.reference.publicationContext;

    formattedRegistration = {
      ...degreeRegistration,
      entityDescription: {
        ...degreeRegistration.entityDescription,
        reference: {
          ...degreeRegistration.entityDescription.reference,
          publicationContext: {
            ...degreeRegistration.entityDescription.reference.publicationContext,
            course: course?.code ? { ...course, type: 'UnconfirmedCourse' } : undefined,
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
    primaryRoles: [ContributorRole.Creator, ContributorRole.Editor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [BookType.AcademicCommentary]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Editor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [BookType.NonFictionMonograph]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Editor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [BookType.PopularScienceMonograph]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Editor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [BookType.Textbook]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Editor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [BookType.Encyclopedia]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Editor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [BookType.ExhibitionCatalog]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Editor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [BookType.Anthology]: {
    primaryRoles: [ContributorRole.Editor, ContributorRole.Creator],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  // Report
  [ReportType.Research]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Editor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [ReportType.Policy]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Editor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [ReportType.WorkingPaper]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Editor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [ReportType.BookOfAbstracts]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Editor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [ReportType.ConferenceReport]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Editor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  [ReportType.Report]: {
    primaryRoles: [ContributorRole.Creator, ContributorRole.Editor],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
  },
  // Degree
  [DegreeType.Bachelor]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [
      ContributorRole.Supervisor,
      ContributorRole.ContactPerson,
      ContributorRole.RightsHolder,
      ContributorRole.Other,
    ],
  },
  [DegreeType.Master]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [
      ContributorRole.Supervisor,
      ContributorRole.ContactPerson,
      ContributorRole.RightsHolder,
      ContributorRole.Other,
    ],
  },
  [DegreeType.Phd]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [
      ContributorRole.Supervisor,
      ContributorRole.ContactPerson,
      ContributorRole.RightsHolder,
      ContributorRole.Other,
    ],
  },
  [DegreeType.ArtisticPhd]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [
      ContributorRole.Supervisor,
      ContributorRole.ContactPerson,
      ContributorRole.RightsHolder,
      ContributorRole.Other,
    ],
  },
  [DegreeType.Licentiate]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [
      ContributorRole.Supervisor,
      ContributorRole.ContactPerson,
      ContributorRole.RightsHolder,
      ContributorRole.Other,
    ],
  },
  [DegreeType.Other]: {
    primaryRoles: [ContributorRole.Creator],
    secondaryRoles: [
      ContributorRole.Supervisor,
      ContributorRole.ContactPerson,
      ContributorRole.RightsHolder,
      ContributorRole.Other,
    ],
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
    primaryRoles: [
      ContributorRole.Journalist,
      ContributorRole.InterviewSubject,
      ContributorRole.Creator,
      ContributorRole.Other,
    ],
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

export const getContributorsWithPrimaryRole = (
  contributors: PreviewContributor[] | Contributor[],
  registrationType: PublicationInstanceType
) => {
  const { primaryRoles } = contributorConfig[registrationType];

  return contributors.filter((contributor) => {
    const roleValue = typeof contributor.role === 'string' ? contributor.role : contributor.role.type;
    return primaryRoles.includes(roleValue);
  });
};

export const getContributorsWithSecondaryRole = (
  contributors: PreviewContributor[] | Contributor[],
  registrationType: PublicationInstanceType
) => {
  const { secondaryRoles } = contributorConfig[registrationType];
  return contributors.filter((contributor) => {
    const roleValue = typeof contributor.role === 'string' ? contributor.role : contributor.role.type;
    return secondaryRoles.includes(roleValue);
  });
};

export const getOutputName = (item: OutputItem): string => {
  switch (item.type) {
    case 'Venue':
    case 'PerformingArtsVenue':
      return (item as Venue).place?.name ?? '';
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
      return (item as CinematicRelease).place.name;
    case 'OtherRelease': {
      const otherRelease = item as OtherRelease;
      return [otherRelease.publisher.name, otherRelease.place.name].filter(Boolean).join('/');
    }
    case 'MusicScore':
      return (item as MusicScore).publisher.name;
    case 'AudioVisualPublication':
      return (item as AudioVisualPublication).publisher.name;
    case 'Concert':
      return (item as Concert).place.name;
    case 'OtherPerformance': {
      const otherMusicPerformance = item as OtherMusicPerformance;

      return (
        otherMusicPerformance.place?.name ||
        otherMusicPerformance.performanceType ||
        i18n.t('registration.resource_type.artistic.output_type.OtherPerformance')
      );
    }
    case 'LiteraryArtsMonograph':
      return (item as LiteraryArtsMonograph).publisher.name;
    case 'LiteraryArtsPerformance':
      return (item as LiteraryArtsPerformance).place.name;
    case 'LiteraryArtsAudioVisual':
      return (item as LiteraryArtsAudioVisual).publisher.name;
    case 'LiteraryArtsWeb':
      return (item as LiteraryArtsWeb).publisher.name;
    case 'ExhibitionBasic':
      return (item as ExhibitionBasic).organization.name;
    default:
      return '';
  }
};

export const userHasAccessRight = (registration: Registration | undefined, operation: RegistrationOperation) =>
  registration?.allowedOperations?.includes(operation) ?? false;

export const hyphenateIsrc = (isrc: string) =>
  isrc ? `${isrc.substring(0, 2)}-${isrc.substring(2, 5)}-${isrc.substring(5, 7)}-${isrc.substring(7, 12)}` : '';

export const getTitleString = (title: string | undefined) => title || `[${i18n.t('registration.missing_title')}]`;

const allFileTypes: string[] = Object.values(FileType);
export const associatedArtifactIsFile = ({ type }: { type: string }) => allFileTypes.includes(type);

export const associatedArtifactIsLink = ({ type }: { type: string }) => type === 'AssociatedLink';

export const associatedArtifactIsNullArtifact = ({ type }: { type: string }) => type === 'NullAssociatedArtifact';

export const getAssociatedFiles = (associatedArtifacts: AssociatedArtifact[]) =>
  associatedArtifacts.filter(associatedArtifactIsFile) as AssociatedFile[];

export const getAssociatedLinks = (associatedArtifacts: AssociatedArtifact[]) =>
  associatedArtifacts.filter(associatedArtifactIsLink) as AssociatedLink[];

export const getOpenFiles = (associatedArtifacts: AssociatedArtifact[]) =>
  associatedArtifacts.filter(isOpenFile) as AssociatedFile[];

export const isPendingOpenFile = (artifact: AssociatedArtifact) => artifact.type === FileType.PendingOpenFile;

export const isOpenFile = (artifact: AssociatedArtifact) => artifact.type === FileType.OpenFile;

export const isTypeWithRrs = (publicationInstanceType?: string) =>
  publicationInstanceType === JournalType.AcademicArticle ||
  publicationInstanceType === JournalType.AcademicLiteratureReview;

export const isTypeWithFileVersionField = (publicationInstanceType?: string) =>
  isJournal(publicationInstanceType) || isBook(publicationInstanceType) || isChapter(publicationInstanceType);

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

export const findRelatedDocumentIndex = (related: RelatedDocument[], uri: string) =>
  related.findIndex((document) => document.type === 'ConfirmedDocument' && document.identifier === uri);

export const getDisabledCategories = (
  user: User | null,
  customer: CustomerInstitution | null,
  registration: Registration,
  t: TFunction
) => {
  const disabledCategories: DisabledCategory[] = [];

  if (!user?.isThesisCurator) {
    Object.values(DegreeType).forEach((type) => {
      disabledCategories.push({ type, text: t('registration.resource_type.protected_degree_type') });
    });
  }

  const hasFiles = getAssociatedFiles(registration.associatedArtifacts).length > 0;

  if (hasFiles && customer && customer.allowFileUploadForTypes.length !== allPublicationInstanceTypes.length) {
    const categoriesWithoutFileSupport = allPublicationInstanceTypes
      .filter((type) => !customer.allowFileUploadForTypes.includes(type))
      .map((type) => ({ type, text: t('registration.resource_type.protected_file_type') }));

    disabledCategories.push(...categoriesWithoutFileSupport);
  }

  return disabledCategories;
};

export const findParentSubject = (disciplines: NpiSubjectDomain[], npiSubjectHeadingId: string) => {
  const parent = disciplines.find((domain) =>
    domain.subdomains.some((subdomain) => subdomain.id === npiSubjectHeadingId)
  );
  return parent ? parent.id : null;
};

export const registrationLanguageOptions = [
  getLanguageByIso6393Code('eng'),
  getLanguageByIso6393Code('nob'),
  getLanguageByIso6393Code('nno'),
  getLanguageByIso6393Code('dan'),
  getLanguageByIso6393Code('fin'),
  getLanguageByIso6393Code('fra'),
  getLanguageByIso6393Code('isl'),
  getLanguageByIso6393Code('ita'),
  getLanguageByIso6393Code('nld'),
  getLanguageByIso6393Code('por'),
  getLanguageByIso6393Code('rus'),
  getLanguageByIso6393Code('sme'),
  getLanguageByIso6393Code('spa'),
  getLanguageByIso6393Code('swe'),
  getLanguageByIso6393Code('deu'),
  getLanguageByIso6393Code('mis'),
];

export const registrationsHaveSamePublicationYear = (
  registration: Registration,
  registrationSearchItem: RegistrationSearchItem
) => {
  const registrationPublicationYear = registration.entityDescription?.publicationDate?.year;

  const registrationSearchItemPublicationYear = registrationSearchItem.publicationDate?.year;

  if (registrationPublicationYear === undefined || registrationSearchItemPublicationYear === undefined) {
    return false;
  }

  return registrationPublicationYear === registrationSearchItemPublicationYear;
};

export const registrationsHaveSameCategory = (
  registration: Registration,
  registrationSearchItem: RegistrationSearchItem
) => {
  const registrationCategory = registration.entityDescription?.reference?.publicationInstance?.type;

  const registrationSearchItemCategory = registrationSearchItem.type;

  if (!registrationCategory || !registrationSearchItemCategory) {
    return false;
  }

  return registrationCategory === registrationSearchItemCategory;
};

export const getIssnValuesString = (context: Partial<Pick<ContextSeries, 'onlineIssn' | 'printIssn' | 'issn'>>) => {
  const issnValues = [
    context.printIssn ? `${t('registration.resource_type.print_issn')}: ${context.printIssn}` : '',
    context.onlineIssn ? `${t('registration.resource_type.online_issn')}: ${context.onlineIssn}` : '',
    context.issn ? `${t('registration.resource_type.issn')}: ${context.issn}` : '',
  ].filter(Boolean);
  return issnValues.join(', ');
};

export const convertToRegistrationSearchItem = (registration: Registration) => {
  const publisher =
    registration.entityDescription?.reference?.publicationContext &&
    'publisher' in registration.entityDescription.reference.publicationContext
      ? {
          id: registration.entityDescription.reference.publicationContext.publisher?.id,
          name: registration.entityDescription.reference.publicationContext.publisher?.name,
        }
      : undefined;

  const journalId =
    registration.entityDescription?.reference?.publicationContext &&
    'id' in registration.entityDescription.reference.publicationContext
      ? (registration.entityDescription.reference.publicationContext.id ?? undefined)
      : undefined;

  const series =
    registration.entityDescription?.reference?.publicationContext &&
    'series' in registration.entityDescription.reference.publicationContext
      ? registration.entityDescription.reference.publicationContext.series
      : undefined;

  const contributors =
    registration.entityDescription?.contributors.map((contributor) => ({
      affiliation: contributor.affiliations,
      correspondingAuthor: contributor.correspondingAuthor,
      identity: contributor.identity,
      role: contributor.role.type,
    })) ?? [];

  const registrationSearchItem: RegistrationSearchItem = {
    type: registration.entityDescription?.reference?.publicationInstance.type ?? '',
    id: registration.id,
    identifier: registration.identifier,
    recordMetadata: {
      createdDate: registration.createdDate,
      modifiedDate: registration.modifiedDate,
      publishedDate: registration.publishedDate,
      status: registration.status,
    },
    mainTitle: registration.entityDescription?.mainTitle ?? '',
    contributorsCount: contributors.length,
    abstract: registration.entityDescription?.abstract ?? '',
    description: registration.entityDescription?.description ?? '',
    publicationDate: registration.entityDescription?.publicationDate,
    publishingDetails: {
      id: journalId,
      type: (registration.entityDescription?.reference?.publicationContext.type ?? undefined) as
        | PublicationType
        | undefined,
      series: {
        name: series?.title,
        id: series?.id,
      },
      publisher: publisher,
      doi: registration.entityDescription?.reference?.doi,
    },
    contributorsPreview: contributors,
  };
  return registrationSearchItem;
};

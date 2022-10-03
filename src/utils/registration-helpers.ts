import { PublicationInstanceType, Registration } from '../types/registration.types';
import {
  ArtisticType,
  BookType,
  ChapterType,
  DegreeType,
  JournalType,
  MediaType,
  PresentationType,
  PublicationType,
  ReportType,
  ResearchDataType,
} from '../types/publicationFieldNames';
import { User } from '../types/user.types';
import i18n from '../translations/i18n';
import { PresentationRegistration } from '../types/publication_types/presentationRegistration.types';
import { Period } from '../types/common.types';
import { Contributor, ContributorRole } from '../types/contributor.types';
import {
  Award,
  Broadcast,
  Competition,
  Exhibition,
  MentionInPublication,
  ArtisticOutputItem,
  Venue,
  CinematicRelease,
  OtherRelease,
  MusicScore,
  AudioVisualPublication,
  Concert,
  OtherMusicPerformance,
} from '../types/publication_types/artisticRegistration.types';
import { JournalRegistration } from '../types/publication_types/journalRegistration.types';

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
    ? PublicationType.Chapter
    : isPresentation(instanceType)
    ? PublicationType.Presentation
    : isArtistic(instanceType)
    ? PublicationType.Artistic
    : isMediaContribution(instanceType)
    ? PublicationType.MediaContribution
    : isResearchData(instanceType)
    ? PublicationType.ResearchData
    : '';

export const isJournal = (instanceType: string) => Object.values(JournalType).some((type) => type === instanceType);

export const isBook = (instanceType: string) => Object.values(BookType).some((type) => type === instanceType);

export const isDegree = (instanceType: string) => Object.values(DegreeType).some((type) => type === instanceType);

export const isReport = (instanceType: string) => Object.values(ReportType).some((type) => type === instanceType);

export const isChapter = (instanceType: string) => Object.values(ChapterType).some((type) => type === instanceType);

export const isPresentation = (instanceType: string) =>
  Object.values(PresentationType).some((type) => type === instanceType);

export const isArtistic = (instanceType: string) => Object.values(ArtisticType).some((type) => type === instanceType);

export const isMediaContribution = (instanceType: string) =>
  Object.values(MediaType).some((type) => type === instanceType);

export const isResearchData = (instanceType: string) =>
  Object.values(ResearchDataType).some((type) => type === instanceType);

export const userIsRegistrationOwner = (user: User | null, registration?: Registration) =>
  !!user && !!registration && user.isCreator && user.username === registration.resourceOwner.owner;

export const userIsRegistrationCurator = (user: User | null, registration?: Registration) =>
  !!user && !!registration && user.isCurator && user.customerId === registration.publisher.id;

export const getYearQuery = (yearValue: string) =>
  yearValue && Number.isInteger(Number(yearValue)) ? yearValue : new Date().getFullYear();

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

export const getPublicationChannelString = (title: string, onlineIssn?: string | null, printIssn?: string | null) => {
  const issnString = getPublicationChannelIssnString(onlineIssn, printIssn);
  return issnString ? `${title} (${issnString})` : title;
};

export const getRegistrationIdentifier = (id: string) => id.split('/').pop() ?? '';

// Ensure Registration has correct type values, etc
export const getFormattedRegistration = (registration: Registration) => {
  const type = registration.entityDescription?.reference?.publicationInstance.type ?? '';
  let formattedRegistration = registration;

  if (formattedRegistration.entityDescription && !formattedRegistration.entityDescription.type) {
    formattedRegistration.entityDescription.type = 'EntityDescription';
  }
  if (formattedRegistration.entityDescription?.reference && !formattedRegistration.entityDescription.reference.type) {
    formattedRegistration.entityDescription.reference.type = 'Reference';
  }
  if (formattedRegistration.fileSet && !formattedRegistration.fileSet?.type) {
    formattedRegistration.fileSet.type = 'FileSet';
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

export const getPeriodString = (period: Period | null) => {
  const fromDate = period?.from ? new Date(period.from).toLocaleDateString() : '';
  const toDate = period?.to ? new Date(period.to).toLocaleDateString() : '';

  if (!fromDate && !toDate) {
    return '';
  } else {
    return fromDate === toDate ? fromDate : `${fromDate ?? '?'} - ${toDate ?? '?'}`;
  }
};

type ContributorConfig = {
  [type in PublicationInstanceType]: { primaryRoles: ContributorRole[]; secondaryRoles: ContributorRole[] };
};

export const contributorConfig: ContributorConfig = {
  // Journal
  [JournalType.Article]: {
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
  // Book
  [BookType.Monograph]: {
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
  [ChapterType.AnthologyChapter]: {
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
      ContributorRole.Other,
    ],
    secondaryRoles: [ContributorRole.ContactPerson, ContributorRole.RightsHolder, ContributorRole.Other],
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
};

export const groupContributors = (contributors: Contributor[], registrationType: PublicationInstanceType) => {
  const { primaryRoles, secondaryRoles } = contributorConfig[registrationType];
  const primaryContributors = contributors.filter((contributor) => primaryRoles.includes(contributor.role));
  const secondaryContributors = contributors.filter((contributor) => secondaryRoles.includes(contributor.role));

  return { primaryContributors, secondaryContributors };
};

export const getArtisticOutputName = (item: ArtisticOutputItem) => {
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
    case 'OtherRelease':
      return (item as OtherRelease).description;
    case 'MusicScore':
      return (item as MusicScore).publisher.name;
    case 'AudioVisualPublication':
      return (item as AudioVisualPublication).publisher;
    case 'Concert':
      return (item as Concert).place.label;
    case 'OtherPerformance':
      return (item as OtherMusicPerformance).place.label;
    default:
      return '';
  }
};

export const userIsOwnerOfRegistration = (user: User | null, registration: Registration) =>
  !!user?.isCreator && !!user.username && user.username === registration.resourceOwner.owner;

export const userIsCuratorForRegistration = (user: User | null, registration: Registration) =>
  !!user?.isCurator && !!user.customerId && user.customerId === registration.publisher.id;

export const hyphenateIsrc = (isrc: string) =>
  isrc ? `${isrc.substring(0, 2)}-${isrc.substring(2, 5)}-${isrc.substring(5, 7)}-${isrc.substring(7, 12)}` : '';

export const getTitleString = (title: string | undefined) => title || `[${i18n.t('registration.missing_title')}]`;

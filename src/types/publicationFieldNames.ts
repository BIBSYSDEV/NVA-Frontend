export enum PublicationType {
  PublicationInJournal = 'Journal',
  Book = 'Book',
  Report = 'Report',
  Degree = 'Degree',
  Anthology = 'Anthology',
  Presentation = 'Event',
  Artistic = 'Artistic',
  MediaContribution = 'MediaContribution',
  ResearchData = 'ResearchData',
  ExhibitionContent = 'ExhibitionContent',
  GeographicalContent = 'GeographicalContent',
}

export enum JournalType {
  AcademicArticle = 'AcademicArticle',
  AcademicLiteratureReview = 'AcademicLiteratureReview',
  Letter = 'JournalLetter',
  Review = 'JournalReview',
  Leader = 'JournalLeader',
  Corrigendum = 'JournalCorrigendum',
  Issue = 'JournalIssue',
  ConferenceAbstract = 'ConferenceAbstract',
  CaseReport = 'CaseReport',
  StudyProtocol = 'StudyProtocol',
  ProfessionalArticle = 'ProfessionalArticle',
  PopularScienceArticle = 'PopularScienceArticle',
}

export enum BookType {
  AcademicMonograph = 'AcademicMonograph',
  AcademicCommentary = 'AcademicCommentary',
  NonFictionMonograph = 'NonFictionMonograph',
  PopularScienceMonograph = 'PopularScienceMonograph',
  Textbook = 'Textbook',
  Encyclopedia = 'Encyclopedia',
  ExhibitionCatalog = 'ExhibitionCatalog',
  Anthology = 'BookAnthology',
}

export enum ReportType {
  Research = 'ReportResearch',
  Policy = 'ReportPolicy',
  WorkingPaper = 'ReportWorkingPaper',
  BookOfAbstracts = 'ReportBookOfAbstract',
  ConferenceReport = 'ConferenceReport',
  Report = 'ReportBasic',
}

export enum DegreeType {
  Bachelor = 'DegreeBachelor',
  Master = 'DegreeMaster',
  Phd = 'DegreePhd',
  ArtisticPhd = 'ArtisticDegreePhd',
  Licentiate = 'DegreeLicentiate',
  Other = 'OtherStudentWork',
}

export enum ChapterType {
  AcademicChapter = 'AcademicChapter',
  NonFictionChapter = 'NonFictionChapter',
  PopularScienceChapter = 'PopularScienceChapter',
  TextbookChapter = 'TextbookChapter',
  EncyclopediaChapter = 'EncyclopediaChapter',
  Introduction = 'Introduction',
  ExhibitionCatalogChapter = 'ExhibitionCatalogChapter',
  ReportChapter = 'ChapterInReport',
  ConferenceAbstract = 'ChapterConferenceAbstract',
}

export enum PresentationType {
  ConferenceLecture = 'ConferenceLecture',
  ConferencePoster = 'ConferencePoster',
  Lecture = 'Lecture',
  OtherPresentation = 'OtherPresentation',
}

export enum ArtisticType {
  MusicPerformance = 'MusicPerformance',
  ArtisticDesign = 'ArtisticDesign',
  ArtisticArchitecture = 'Architecture',
  VisualArts = 'VisualArts',
  PerformingArts = 'PerformingArts',
  MovingPicture = 'MovingPicture',
  LiteraryArts = 'LiteraryArts',
}

export enum MediaType {
  MediaFeatureArticle = 'MediaFeatureArticle',
  MediaReaderOpinion = 'MediaReaderOpinion',
  MediaInterview = 'MediaInterview',
  MediaBlogPost = 'MediaBlogPost',
  MediaPodcast = 'MediaPodcast',
  MediaParticipationInRadioOrTv = 'MediaParticipationInRadioOrTv',
}

export enum ExhibitionContentType {
  ExhibitionProduction = 'ExhibitionProduction',
}

export enum OtherRegistrationType {
  Map = 'Map',
}

export enum ResearchDataType {
  DataManagementPlan = 'DataManagementPlan',
  Dataset = 'DataSet',
}

export const allPublicationInstanceTypes = [
  ...Object.values(JournalType),
  ...Object.values(BookType),
  ...Object.values(ReportType),
  ...Object.values(DegreeType),
  ...Object.values(ChapterType),
  ...Object.values(PresentationType),
  ...Object.values(ArtisticType),
  ...Object.values(MediaType),
  ...Object.values(ResearchDataType),
  ...Object.values(ExhibitionContentType),
  ...Object.values(OtherRegistrationType),
];

// Enums representing name of fields used by Formik
export const contextTypeBaseFieldName = 'entityDescription.reference.publicationContext';
export const instanceTypeBaseFieldName = 'entityDescription.reference.publicationInstance';

export enum ResourceFieldNames {
  ArticleNumber = 'entityDescription.reference.publicationInstance.articleNumber',
  CorrigendumFor = 'entityDescription.reference.publicationInstance.corrigendumFor',
  Doi = 'entityDescription.reference.doi',
  IsbnList = 'entityDescription.reference.publicationContext.isbnList',
  Issue = 'entityDescription.reference.publicationInstance.issue',
  NpiSubjectHeading = 'entityDescription.npiSubjectHeading',
  PagesFrom = 'entityDescription.reference.publicationInstance.pages.begin',
  PagesTo = 'entityDescription.reference.publicationInstance.pages.end',
  PagesType = 'entityDescription.reference.publicationInstance.pages.type',
  PagesPages = 'entityDescription.reference.publicationInstance.pages.pages',
  PublicationContextAgentName = 'entityDescription.reference.publicationContext.agent.name',
  PublicationContextId = 'entityDescription.reference.publicationContext.id',
  PublicationContextLevel = 'entityDescription.reference.publicationContext.level',
  PublicationContextMediaChannel = 'entityDescription.reference.publicationContext.disseminationChannel',
  PublicationContextMediaFormat = 'entityDescription.reference.publicationContext.format',
  PublicationContextMediaMediumType = 'entityDescription.reference.publicationContext.medium.type',
  PublicationContextMediaPartOfSeriesName = 'entityDescription.reference.publicationContext.partOf.seriesName',
  PublicationContextMediaPartOfSeriesPart = 'entityDescription.reference.publicationContext.partOf.seriesPart',
  PublicationContextName = 'entityDescription.reference.publicationContext.name',
  PublicationContextPlaceCountry = 'entityDescription.reference.publicationContext.place.country',
  PublicationContextPlaceName = 'entityDescription.reference.publicationContext.place.name',
  PublicationContextPublisher = 'entityDescription.reference.publicationContext.publisher',
  PublicationContextPublisherId = 'entityDescription.reference.publicationContext.publisher.id',
  PublicationContextPublisherType = 'entityDescription.reference.publicationContext.publisher.type',
  PublicationContextTimeFrom = 'entityDescription.reference.publicationContext.time.from',
  PublicationContextTimeTo = 'entityDescription.reference.publicationContext.time.to',
  PublicationContextType = 'entityDescription.reference.publicationContext.type',
  PublicationContextCourseCode = 'entityDescription.reference.publicationContext.course.code',
  PublicationInstanceAgreeTerms = 'entityDescription.reference.publicationInstance.userAgreesToTermsAndConditions',
  PublicationInstanceArchitectureOutput = 'entityDescription.reference.publicationInstance.architectureOutput',
  PublicationInstanceCompliesWith = 'entityDescription.reference.publicationInstance.compliesWith',
  PublicationInstanceDescription = 'entityDescription.reference.publicationInstance.description',
  PublicationInstanceGeographicDescription = 'entityDescription.reference.publicationInstance.geographicalCoverage.description',
  PublicationInstanceManifestations = 'entityDescription.reference.publicationInstance.manifestations',
  PublicationInstanceOutputs = 'entityDescription.reference.publicationInstance.outputs',
  PublicationInstanceSubtypeDescription = 'entityDescription.reference.publicationInstance.subtype.description',
  PublicationInstanceSubtypeType = 'entityDescription.reference.publicationInstance.subtype.type',
  PublicationInstanceVenues = 'entityDescription.reference.publicationInstance.venues',
  PublicationInstanceReferencedBy = 'entityDescription.reference.publicationInstance.referencedBy',
  PublicationInstanceRelated = 'entityDescription.reference.publicationInstance.related',
  Reference = 'entityDescription.reference',
  Revision = 'entityDescription.reference.publicationContext.revision',
  Series = 'entityDescription.reference.publicationContext.series',
  SeriesId = 'entityDescription.reference.publicationContext.series.id',
  SeriesNumber = 'entityDescription.reference.publicationContext.seriesNumber',
  SeriesTitle = 'entityDescription.reference.publicationContext.series.title',
  SeriesType = 'entityDescription.reference.publicationContext.series.type',
  RegistrationType = 'entityDescription.reference.publicationInstance.type',
  Volume = 'entityDescription.reference.publicationInstance.volume',
}

export enum DescriptionFieldNames {
  Abstract = 'entityDescription.abstract',
  AlternativeAbstracts = 'entityDescription.alternativeAbstracts.und',
  AlternativeTitles = 'entityDescription.alternativeTitles.und',
  Description = 'entityDescription.description',
  Fundings = 'fundings',
  Language = 'entityDescription.language',
  Projects = 'projects',
  PublicationDate = 'entityDescription.publicationDate',
  PublicationDay = 'entityDescription.publicationDate.day',
  PublicationMonth = 'entityDescription.publicationDate.month',
  PublicationYear = 'entityDescription.publicationDate.year',
  Subjects = 'subjects',
  Tags = 'entityDescription.tags',
  Title = 'entityDescription.mainTitle',
}

export enum FileFieldNames {
  AssociatedArtifacts = 'associatedArtifacts',
}

// The following fields should be present in "associatedArtifacts[index].<KEY> for files"
export enum SpecificFileFieldNames {
  Type = 'type',
  PublisherVersion = 'publisherVersion',
  EmbargoDate = 'embargoDate',
  License = 'license',
  LegalNote = 'legalNote',
  RightsRetentionStrategy = 'rightsRetentionStrategy',
}

// The following fields should be present in "associatedArtifacts[index].<KEY> for links"
export enum SpecificLinkFieldNames {
  Id = 'id',
}

export enum ContributorFieldNames {
  Contributors = 'entityDescription.contributors',
}

// The following fields should be present in "entityDescription.contributors[index].<KEY>"
export enum SpecificContributorFieldNames {
  Affiliations = 'affiliations',
  Corresponding = 'correspondingAuthor',
  RoleType = 'role.type',
  Sequence = 'sequence',
}

// The following fields should be present in "fundings[index].<KEY>"
export enum SpecificFundingFieldNames {
  Source = 'source',
  Identifier = 'identifier',
  Id = 'id',
  Amount = 'fundingAmount.amount',
  Currency = 'fundingAmount.currency',
  NorwegianLabel = 'labels.nb',
}

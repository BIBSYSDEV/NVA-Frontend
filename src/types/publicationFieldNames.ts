export enum PublicationType {
  PublicationInJournal = 'Journal',
  Book = 'Book',
  Report = 'Report',
  Degree = 'Degree',
  Chapter = 'Chapter',
  Presentation = 'Event',
  Artistic = 'Artistic',
  MediaContribution = 'MediaContribution',
  ResearchData = 'ResearchData',
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
  Report = 'ReportBasic',
}

export enum DegreeType {
  Bachelor = 'DegreeBachelor',
  Master = 'DegreeMaster',
  Phd = 'DegreePhd',
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
  ArtisticDesign = 'ArtisticDesign',
  ArtisticArchitecture = 'Architecture',
  PerformingArts = 'PerformingArts',
  MovingPicture = 'MovingPicture',
  MusicPerformance = 'MusicPerformance',
  VisualArts = 'VisualArts',
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

export enum OtherRegistrationType {
  Map = 'Map',
}

export enum ResearchDataType {
  DataManagementPlan = 'DataManagementPlan',
  Dataset = 'DataSet',
}

export type RegistrationSubtype =
  | JournalType
  | ReportType
  | BookType
  | DegreeType
  | ChapterType
  | PresentationType
  | ArtisticType
  | MediaType
  | ResearchDataType;

export enum RegistrationFieldName {
  Identifier = 'identifier',
  ModifiedDate = 'modifiedDate',
  PublishedDate = 'publishedDate',
}

// Enums representing name of fields used by Formik
export const contextTypeBaseFieldName = 'entityDescription.reference.publicationContext';
export const instanceTypeBaseFieldName = 'entityDescription.reference.publicationInstance';

export enum ResourceFieldNames {
  ArticleNumber = 'entityDescription.reference.publicationInstance.articleNumber',
  CorrigendumFor = 'entityDescription.reference.publicationInstance.corrigendumFor',
  Doi = 'entityDescription.reference.doi',
  IsbnList = 'entityDescription.reference.publicationContext.isbnList',
  Isbn = 'entityDescription.reference.publicationContext.isbnList[0]',
  Issue = 'entityDescription.reference.publicationInstance.issue',
  NpiSubjectHeading = 'entityDescription.npiSubjectHeading',
  PagesFrom = 'entityDescription.reference.publicationInstance.pages.begin',
  PagesTo = 'entityDescription.reference.publicationInstance.pages.end',
  PagesType = 'entityDescription.reference.publicationInstance.pages.type',
  PagesPages = 'entityDescription.reference.publicationInstance.pages.pages',
  PartOf = 'entityDescription.reference.publicationContext.partOf',
  PublicationContextAgentName = 'entityDescription.reference.publicationContext.agent.name',
  PublicationContextId = 'entityDescription.reference.publicationContext.id',
  PublicationContextLabel = 'entityDescription.reference.publicationContext.label',
  PublicationContextLevel = 'entityDescription.reference.publicationContext.level',
  PublicationContextMediaChannel = 'entityDescription.reference.publicationContext.disseminationChannel',
  PublicationContextMediaFormat = 'entityDescription.reference.publicationContext.format',
  PublicationContextMediaMediumType = 'entityDescription.reference.publicationContext.medium.type',
  PublicationContextMediaPartOfSeriesName = 'entityDescription.reference.publicationContext.partOf.seriesName',
  PublicationContextMediaPartOfSeriesPart = 'entityDescription.reference.publicationContext.partOf.seriesPart',
  PublicationContextPlaceLabel = 'entityDescription.reference.publicationContext.place.label',
  PublicationContextPlaceCountry = 'entityDescription.reference.publicationContext.place.country',
  PublicationContextPublisher = 'entityDescription.reference.publicationContext.publisher',
  PublicationContextPublisherId = 'entityDescription.reference.publicationContext.publisher.id',
  PublicationContextPublisherType = 'entityDescription.reference.publicationContext.publisher.type',
  PublicationContextTimeFrom = 'entityDescription.reference.publicationContext.time.from',
  PublicationContextTimeTo = 'entityDescription.reference.publicationContext.time.to',
  PublicationContextType = 'entityDescription.reference.publicationContext.type',
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
  Series = 'entityDescription.reference.publicationContext.series',
  SeriesId = 'entityDescription.reference.publicationContext.series.id',
  SeriesNumber = 'entityDescription.reference.publicationContext.seriesNumber',
  SeriesTitle = 'entityDescription.reference.publicationContext.series.title',
  SeriesType = 'entityDescription.reference.publicationContext.series.type',
  SubType = 'entityDescription.reference.publicationInstance.type',
  Volume = 'entityDescription.reference.publicationInstance.volume',
}

export enum DescriptionFieldNames {
  Abstract = 'entityDescription.abstract',
  Date = 'entityDescription.date',
  Description = 'entityDescription.description',
  Fundings = 'fundings',
  Language = 'entityDescription.language',
  Projects = 'projects',
  PublicationDay = 'entityDescription.date.day',
  PublicationMonth = 'entityDescription.date.month',
  PublicationYear = 'entityDescription.date.year',
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
  AdministrativeAgreement = 'administrativeAgreement',
  PublisherAuthority = 'publisherAuthority',
  EmbargoDate = 'embargoDate',
  License = 'license',
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
  Id = 'identity.id',
  Name = 'identity.name',
  Role = 'role',
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

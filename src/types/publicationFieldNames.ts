export enum PublicationType {
  PublicationInJournal = 'Journal',
  Book = 'Book',
  Report = 'Report',
  Degree = 'Degree',
  Chapter = 'Chapter',
  Presentation = 'Event',
  Artistic = 'Artistic',
}

export enum JournalType {
  Article = 'JournalArticle',
  FeatureArticle = 'FeatureArticle',
  Letter = 'JournalLetter',
  Review = 'JournalReview',
  Leader = 'JournalLeader',
  Corrigendum = 'JournalCorrigendum',
}

export enum BookType {
  Monograph = 'BookMonograph',
  Anthology = 'BookAnthology',
}

export enum ReportType {
  Research = 'ReportResearch',
  Policy = 'ReportPolicy',
  WorkingPaper = 'ReportWorkingPaper',
  Report = 'ReportBasic',
}

export enum DegreeType {
  Bachelor = 'DegreeBachelor',
  Master = 'DegreeMaster',
  Phd = 'DegreePhd',
  Other = 'OtherStudentWork',
}

export enum ChapterType {
  AnthologyChapter = 'ChapterArticle',
}

export enum PresentationType {
  ConferenceLecture = 'ConferenceLecture',
  ConferencePoster = 'ConferencePoster',
  Lecture = 'Lecture',
  OtherPresentation = 'OtherPresentation',
}

export enum ArtisticType {
  ArtisticDesign = 'ArtisticDesign',
}

export type RegistrationSubtype =
  | JournalType
  | ReportType
  | BookType
  | DegreeType
  | ChapterType
  | PresentationType
  | ArtisticType;

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
  ContentType = 'entityDescription.reference.publicationInstance.contentType',
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
  PeerReviewed = 'entityDescription.reference.publicationInstance.peerReviewed',
  PublicationContextAgentName = 'entityDescription.reference.publicationContext.agent.name',
  PublicationContextId = 'entityDescription.reference.publicationContext.id',
  PublicationContextLabel = 'entityDescription.reference.publicationContext.label',
  PublicationContextLevel = 'entityDescription.reference.publicationContext.level',
  PublicationContextPlaceLabel = 'entityDescription.reference.publicationContext.place.label',
  PublicationContextPlaceCountry = 'entityDescription.reference.publicationContext.place.country',
  PublicationContextPublisher = 'entityDescription.reference.publicationContext.publisher',
  PublicationContextPublisherId = 'entityDescription.reference.publicationContext.publisher.id',
  PublicationContextPublisherType = 'entityDescription.reference.publicationContext.publisher.type',
  PublicationContextTimeFrom = 'entityDescription.reference.publicationContext.time.from',
  PublicationContextTimeTo = 'entityDescription.reference.publicationContext.time.to',
  PublicationContextType = 'entityDescription.reference.publicationContext.type',
  PublicationInstanceDescription = 'entityDescription.reference.publicationInstance.description',
  PublicationInstanceSubtypeDescription = 'entityDescription.reference.publicationInstance.subtype.description',
  PublicationInstanceSubtypeType = 'entityDescription.reference.publicationInstance.subtype.type',
  Reference = 'entityDescription.reference',
  SeriesId = 'entityDescription.reference.publicationContext.series.id',
  SeriesNumber = 'entityDescription.reference.publicationContext.seriesNumber',
  SeriesTitle = 'entityDescription.reference.publicationContext.series.title',
  SeriesType = 'entityDescription.reference.publicationContext.series.type',
  SubType = 'entityDescription.reference.publicationInstance.type',
  Venues = 'entityDescription.reference.publicationContext.venues',
  Volume = 'entityDescription.reference.publicationInstance.volume',
}

export enum DescriptionFieldNames {
  Abstract = 'entityDescription.abstract',
  Date = 'entityDescription.date',
  Description = 'entityDescription.description',
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
  Files = 'fileSet.files',
  FileSet = 'fileSet',
}

// The following fields should be present in "fileSet.files[index].<KEY>"
export enum SpecificFileFieldNames {
  AdministrativeAgreement = 'administrativeAgreement',
  PublisherAuthority = 'publisherAuthority',
  EmbargoDate = 'embargoDate',
  License = 'license',
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
  Sequence = 'sequence',
}

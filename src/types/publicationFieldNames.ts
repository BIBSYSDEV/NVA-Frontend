export enum PublicationType {
  PublicationInJournal = 'Journal',
  Book = 'Book',
  Report = 'Report',
  Degree = 'Degree',
  Chapter = 'Chapter',
  Presentation = 'Event',
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

export type RegistrationSubtype = JournalType | ReportType | BookType | DegreeType | ChapterType;

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
  PubliactionContextId = 'entityDescription.reference.publicationContext.id',
  PublicationContextLabel = 'entityDescription.reference.publicationContext.label',
  PubliactionContextLevel = 'entityDescription.reference.publicationContext.level',
  PublicationContextPlaceLabel = 'entityDescription.reference.publicationContext.place.label',
  PublicationContextPlaceCountry = 'entityDescription.reference.publicationContext.place.country',
  PubliactionContextPublisherId = 'entityDescription.reference.publicationContext.publisher.id',
  PubliactionContextPublisherType = 'entityDescription.reference.publicationContext.publisher.type',
  PubliactionContextType = 'entityDescription.reference.publicationContext.type',
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
  Id = 'id',
  Sequence = 'sequence',
}

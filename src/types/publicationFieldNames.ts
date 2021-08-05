export enum PublicationType {
  PUBLICATION_IN_JOURNAL = 'Journal',
  BOOK = 'Book',
  REPORT = 'Report',
  DEGREE = 'Degree',
  CHAPTER = 'Chapter',
}

export enum JournalType {
  ARTICLE = 'JournalArticle',
  FEATURE_ARTICLE = 'FeatureArticle',
  LETTER = 'JournalLetter',
  REVIEW = 'JournalReview',
  LEADER = 'JournalLeader',
  CORRIGENDUM = 'JournalCorrigendum',
}

export enum BookType {
  MONOGRAPH = 'BookMonograph',
  ANTHOLOGY = 'BookAnthology',
}

export enum ReportType {
  RESEARCH = 'ReportResearch',
  POLICY = 'ReportPolicy',
  WORKING_PAPER = 'ReportWorkingPaper',
  REPORT = 'ReportBasic',
}

export enum DegreeType {
  BACHELOR = 'DegreeBachelor',
  MASTER = 'DegreeMaster',
  PHD = 'DegreePhd',
  OTHER = 'OtherStudentWork',
}

export enum ChapterType {
  AnthologyChapter = 'ChapterArticle',
}

export type RegistrationSubtype = JournalType | ReportType | BookType | DegreeType | ChapterType;

// Enums representing name of fields used by Formik
export const contextTypeBaseFieldName = 'entityDescription.reference.publicationContext';
export const instanceTypeBaseFieldName = 'entityDescription.reference.publicationInstance';

export enum ResourceFieldNames {
  ARTICLE_NUMBER = 'entityDescription.reference.publicationInstance.articleNumber',
  ContentType = 'entityDescription.reference.publicationInstance.contentType',
  CORRIGENDUM_FOR = 'entityDescription.reference.publicationInstance.corrigendumFor',
  DOI = 'entityDescription.reference.doi',
  ISBN_LIST = 'entityDescription.reference.publicationContext.isbnList',
  ISSUE = 'entityDescription.reference.publicationInstance.issue',
  NPI_SUBJECT_HEADING = 'entityDescription.npiSubjectHeading',
  PAGES_FROM = 'entityDescription.reference.publicationInstance.pages.begin',
  PAGES_TO = 'entityDescription.reference.publicationInstance.pages.end',
  PAGES_TYPE = 'entityDescription.reference.publicationInstance.pages.type',
  PAGES_PAGES = 'entityDescription.reference.publicationInstance.pages.pages',
  PEER_REVIEW = 'entityDescription.reference.publicationInstance.peerReviewed',
  OriginalResearch = 'entityDescription.reference.publicationInstance.originalResearch',
  PUBLICATION_CONTEXT_LEVEL = 'entityDescription.reference.publicationContext.level',
  PUBLICATION_CONTEXT_LINKED_CONTEXT = 'entityDescription.reference.publicationContext.linkedContext',
  PUBLICATION_CONTEXT_TITLE = 'entityDescription.reference.publicationContext.title',
  PUBLICATION_CONTEXT_PUBLISHER = 'entityDescription.reference.publicationContext.publisher',
  PUBLICATION_CONTEXT_TYPE = 'entityDescription.reference.publicationContext.type',
  SERIES_NUMBER = 'entityDescription.reference.publicationContext.seriesNumber',
  SERIES_TITLE = 'entityDescription.reference.publicationContext.seriesTitle',
  SUB_TYPE = 'entityDescription.reference.publicationInstance.type',
  VOLUME = 'entityDescription.reference.publicationInstance.volume',
}

export enum DescriptionFieldNames {
  ABSTRACT = 'entityDescription.abstract',
  CONTROLLED_KEYWORDS = 'entityDescription.controlledKeywords',
  DATE = 'entityDescription.date',
  DESCRIPTION = 'entityDescription.description',
  LANGUAGE = 'entityDescription.language',
  PROJECTS = 'projects',
  PUBLICATION_DAY = 'entityDescription.date.day',
  PUBLICATION_MONTH = 'entityDescription.date.month',
  PUBLICATION_YEAR = 'entityDescription.date.year',
  TAGS = 'entityDescription.tags',
  TITLE = 'entityDescription.mainTitle',
}

export enum FileFieldNames {
  FILES = 'fileSet.files',
}

// The following fields should be present in "fileSet.files[index].<KEY>"
export enum SpecificFileFieldNames {
  ADMINISTRATIVE_AGREEMENT = 'administrativeAgreement',
  PUBLISHER_AUTHORITY = 'publisherAuthority',
  EMBARGO_DATE = 'embargoDate',
  LICENSE = 'license',
}

export enum ContributorFieldNames {
  CONTRIBUTORS = 'entityDescription.contributors',
}

// The following fields should be present in "entityDescription.contributors[index].<KEY>"
export enum SpecificContributorFieldNames {
  AFFILIATIONS = 'affiliations',
  CORRESPONDING = 'correspondingAuthor',
  EMAIL = 'email',
  ID = 'id',
  ROLE = 'role', // TODO
  SEQUENCE = 'sequence',
}

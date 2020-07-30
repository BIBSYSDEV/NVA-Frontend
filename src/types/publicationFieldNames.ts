// For valid values, see https://github.com/BIBSYSDEV/nva-datamodel-java/blob/develop/src/main/java/no/unit/nva/model/PublicationType.java
export enum PublicationType {
  PUBLICATION_IN_JOURNAL = 'Journal',
  BOOK = 'Book',
  REPORT = 'Report',
  DEGREE = 'Degree',
  CHAPTER = 'Chapter',
}

export enum ChapterType {
  ARTICLE = 'ChapterArticle',
}

export enum JournalType {
  ARTICLE = 'JournalArticle',
  SHORT_COMMUNICATION = 'JournalShortCommunication',
  LETTER = 'JournalLetter',
  REVIEW = 'JournalReview',
  LEADER = 'JournalLeader',
}

export enum BookType {
  MONOGRAPH = 'BookMonograph',
  ANTHOLOGY = 'BookAnthology',
}

export enum ReportType {
  REPORT = 'Report',
  RESEARCH = 'ReportResearch',
  POLICY = 'ReportPolicy',
  WORKING_PAPER = 'ReportWorkingPaper',
}

export enum DegreeType {
  BACHELOR = 'DegreeBachelor',
  MASTER = 'DegreeMaster',
  PHD = 'DegreePhd',
}

// Enums representing name of fields used by Formik
export const contextTypeBaseFieldName = 'entityDescription.reference.publicationContext';

export enum ReferenceFieldNames {
  ARTICLE_NUMBER = 'entityDescription.reference.publicationInstance.articleNumber',
  DOI = 'entityDescription.reference.doi',
  ISBN = 'entityDescription.isbn',
  ISSUE = 'entityDescription.reference.publicationInstance.issue',
  NUMBER_OF_PAGES = 'entityDescription.numberOfPages',
  PAGES_FROM = 'entityDescription.reference.publicationInstance.pages.begin',
  PAGES_TO = 'entityDescription.reference.publicationInstance.pages.end',
  PEER_REVIEW = 'entityDescription.reference.publicationInstance.peerReviewed',
  PUBLICATION_CONTEXT_LEVEL = 'entityDescription.reference.publicationContext.level',
  PUBLICATION_CONTEXT_TITLE = 'entityDescription.reference.publicationContext.title',
  PUBLICATION_CONTEXT_TYPE = 'entityDescription.reference.publicationContext.type',
  PUBLICATION_INSTANCE_TYPE = 'entityDescription.reference.publicationInstance.type',
  SERIES = 'entityDescription.series',
  SUB_TYPE = 'entityDescription.reference.publicationInstance.type',
  TEXT_BOOK = 'entityDescription.textBook',
  VOLUME = 'entityDescription.reference.publicationInstance.volume',
}

export enum DescriptionFieldNames {
  ABSTRACT = 'entityDescription.abstract',
  DESCRIPTION = 'entityDescription.description',
  LANGUAGE = 'entityDescription.language',
  NPI_SUBJECT_HEADING = 'entityDescription.npiSubjectHeading',
  PROJECT = 'project',
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
  ROLE = 'role', // TODO
  SEQUENCE = 'sequence',
}

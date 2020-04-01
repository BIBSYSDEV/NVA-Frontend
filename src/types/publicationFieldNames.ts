// For valid values, see https://github.com/BIBSYSDEV/nva-datamodel-java/blob/develop/src/main/java/no/unit/nva/model/PublicationType.java
export enum PublicationType {
  PUBLICATION_IN_JOURNAL = 'JournalArticle',
  BOOK = 'Book',
  REPORT = 'Report',
  DEGREE = 'Degree',
  CHAPTER = 'Chapter',
}

export enum JournalArticleType {
  ARTICLE = 'Article',
  SHORT_COMMUNICATION = 'ShortCommunication',
  EDITORIAL = 'Editorial',
  LETTER = 'Letter',
  REVIEW = 'Review',
}

export enum BookType {
  MONOGRAPHY = 'Monography',
  ANTHOLOGY = 'Anthology',
}

export enum ReportType {
  REPORT = 'Report',
  RESEARCH_REPORT = 'ResearchReport',
  POLICY_REPORT = 'PolicyReport',
  WORKING_PAPER = 'WorkingPaper',
}

export enum DegreeType {
  BACHELOR = 'Bachelor',
  MASTER = 'Master',
  DOCTORATE = 'Doctorate',
}

// Enums representing name of fields used by Formik
export enum ReferenceFieldNames {
  ARTICLE_NUMBER = 'entityDescription.reference.publicationInstance.articleNumber',
  DOI = 'entityDescription.reference.doi',
  ISBN = 'entityDescription.isbn',
  ISSUE = 'entityDescription.reference.publicationInstance.issue',
  NUMBER_OF_PAGES = 'entityDescription.numberOfPages',
  PAGES_FROM = 'entityDescription.reference.publicationInstance.pages.begin',
  PAGES_TO = 'entityDescription.reference.publicationInstance.pages.end',
  PEER_REVIEW = 'entityDescription.reference.publicationInstance.peerReviewed',
  PUBLICATION_TYPE = 'entityDescription.publicationType',
  PUBLISHER = 'entityDescription.reference.publicationContext',
  SERIES = 'entityDescription.series',
  SUB_TYPE = 'entityDescription.publicationSubtype',
  TEXT_BOOK = 'entityDescription.textBook',
  VOLUME = 'entityDescription.reference.publicationInstance.volume',
}

export enum DescriptionFieldNames {
  ABSTRACT = 'entityDescription.abstract',
  DESCRIPTION = 'entityDescription.description',
  LANGUAGE = 'entityDescription.language',
  NPI_SUBJECT_HEADING = 'entityDescription.npiSubjectHeading',
  PROJECTS = 'entityDescription.projects',
  PUBLICATION_DAY = 'entityDescription.date.day',
  PUBLICATION_MONTH = 'entityDescription.date.month',
  PUBLICATION_YEAR = 'entityDescription.date.year',
  TAGS = 'entityDescription.tags',
  TITLE = 'entityDescription.mainTitle',
}

export enum FileFieldNames {
  FILE_SET = 'fileSet',
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
  AFFILIATIONS = 'affiliations', // TODO
  CORRESPONDING = 'corresponding',
  EMAIL = 'email',
  ROLE = 'role', // TODO
  SEQUENCE = 'sequence',
}

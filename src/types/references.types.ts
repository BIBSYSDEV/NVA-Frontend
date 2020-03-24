export interface Publisher {
  title: string;
  printIssn: string;
  onlineIssn: string;
  level: number | null;
  openAccess: boolean;
}

export const emptyPublisher: Publisher = {
  printIssn: '',
  onlineIssn: '',
  level: null,
  title: '',
  openAccess: false,
};

// For valid values, see https://github.com/BIBSYSDEV/nva-datamodel-java/blob/develop/src/main/java/no/unit/nva/model/PublicationType.java
export enum ReferenceType {
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
  PUBLICATION_TYPE = 'entityDescription.publicationType',
  DOI = 'entityDescription.reference.doi',
}

export enum JournalArticleFieldNames {
  SUB_TYPE = 'entityDescription.publicationSubtype',
  PUBLISHER = 'entityDescription.reference.publicationContext',
  VOLUME = 'entityDescription.reference.publicationInstance.volume',
  ISSUE = 'entityDescription.reference.publicationInstance.issue',
  PAGES_FROM = 'entityDescription.reference.publicationInstance.pages.begin',
  PAGES_TO = 'entityDescription.reference.publicationInstance.pages.end',
  ARTICLE_NUMBER = 'entityDescription.reference.publicationInstance.articleNumber',
  PEER_REVIEW = 'entityDescription.reference.publicationInstance.peerReviewed',
}

export enum BookFieldNames {
  SUB_TYPE = 'entityDescription.publicationSubtype',
  PUBLISHER = 'entityDescription.reference.publicationContext',
  ISBN = 'entityDescription.isbn',
  PEER_REVIEW = 'entityDescription.reference.publicationInstance.peerReviewed',
  TEXT_BOOK = 'entityDescription.textBook',
  NUMBER_OF_PAGES = 'entityDescription.numberOfPages',
  SERIES = 'entityDescription.series',
}

export enum ReportFieldNames {
  SUB_TYPE = 'entityDescription.publicationSubtype',
  PUBLISHER = 'entityDescription.reference.publicationContext',
  ISBN = 'entityDescription.isbn',
  NUMBER_OF_PAGES = 'entityDescription.numberOfPages',
  SERIES = 'entityDescription.series',
}

export enum DegreeFieldNames {
  SUB_TYPE = 'entityDescription.publicationSubtype',
  PUBLISHER = 'entityDescription.reference.publicationContext',
  SPECIALISATION = 'entityDescription.numberOfPages',
  SERIES = 'entityDescription.series',
}

export enum ChapterFieldNames {
  PUBLISHER = 'entityDescription.reference.publicationContext',
  PAGES_FROM = 'entityDescription.reference.publicationInstance.pages.begin',
  PAGES_TO = 'entityDescription.reference.publicationInstance.pages.end',
}

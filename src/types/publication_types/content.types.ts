export enum JournalArticleContentType {
  AcademicArticle = 'AcademicArticle',
  AcademicLiteratureReview = 'AcademicLiteratureReview',
  CaseReport = 'CaseReport',
  StudyProtocol = 'StudyProtocol',
  ProfessionalArticle = 'ProfessionalArticle',
  PopularScienceArticle = 'PopularScienceArticle',
}

export enum BookMonographContentType {
  AcademicMonograph = 'AcademicMonograph',
  NonFictionMonograph = 'NonFictionMonograph',
  PopularScienceMonograph = 'PopularScienceMonograph',
  Textbook = 'Textbook',
  Encyclopedia = 'Encyclopedia',
  ExhititionCatalog = 'ExhibitionCatalog',
}

export enum ChapterContentType {
  AcademicChapter = 'AcademicChapter',
  NonFictionChapter = 'NonFictionChapter',
  PopularScienceChapter = 'PopularScienceChapter',
  TextbookChapter = 'TextbookChapter',
  EncyclopediaChapter = 'EncyclopediaChapter',
  Introduction = 'Introduction',
  ExhibitionCatalogChapter = 'ExhibitionCatalogChapter',
}

export const nviApplicableContentTypes: string[] = [
  JournalArticleContentType.AcademicArticle,
  JournalArticleContentType.AcademicLiteratureReview,
  BookMonographContentType.AcademicMonograph,
  ChapterContentType.AcademicChapter,
];

export enum JournalArticleContentType {
  AcademicArticle = 'AcademicArticle',
  AcademicLiteratureReview = 'AcademicLiteratureReview',
  CaseReport = 'CaseReport',
  StudyProtocol = 'StudyProtocol',
  ProfessionalArticle = 'ProfessionalArticle',
  PopularScienceArticle = 'PopularScienceArticle',
}

export enum BookMonographContentType {
  AcademicMonograph = 'Academic Monograph',
  NonFictionMonograph = 'Non-fiction Monograph',
  PopularScienceMonograph = 'Popular Science Monograph',
  Textbook = 'Textbook',
  Encyclopedia = 'Encyclopedia',
}

export enum ChapterContentType {
  AcademicChapter = 'Academic Chapter',
  NonFictionChapter = 'Non-fiction Chapter',
  PopularScienceChapter = 'Popular Science Chapter',
  TextbookChapter = 'Textbook Chapter',
  EncyclopediaChapter = 'Encyclopedia Chapter',
  Introduction = 'Introduction',
  ExhibitionCatalogChapter = 'Exhibition Catalog Chapter',
}

export const nviApplicableContentTypes: string[] = [
  JournalArticleContentType.AcademicArticle,
  JournalArticleContentType.AcademicLiteratureReview,
  BookMonographContentType.AcademicMonograph,
  ChapterContentType.AcademicChapter,
];

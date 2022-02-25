export enum JournalArticleContentType {
  AcademicArticle = 'Research article',
  AcademicLiteratureReview = 'Review article',
  CaseReport = 'Case report',
  StudyProtocol = 'Study protocol',
  ProfessionalArticle = 'Professional article',
  PopularScienceArticle = 'Popular science article',
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
}

export const nviApplicableContentTypes: string[] = [
  JournalArticleContentType.AcademicArticle,
  JournalArticleContentType.AcademicLiteratureReview,
  BookMonographContentType.AcademicMonograph,
  ChapterContentType.AcademicChapter,
];

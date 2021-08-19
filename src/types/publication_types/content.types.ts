import i18n from '../../translations/i18n';

export enum JournalArticleContentType {
  ResearchArticle = 'Research article',
  ReviewArticle = 'Review article',
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
  JournalArticleContentType.ResearchArticle,
  JournalArticleContentType.ReviewArticle,
  BookMonographContentType.AcademicMonograph,
  ChapterContentType.AcademicChapter,
];

export interface ContentTypeOption {
  value: string;
  text: string;
}

export const journalArticleContentTypes: ContentTypeOption[] = Object.values(JournalArticleContentType).map(
  (value) => ({
    value,
    text: i18n.t(`registration:resource_type.content_types.${value}`),
  })
);

export const bookMonographContentTypes: ContentTypeOption[] = Object.values(BookMonographContentType).map((value) => ({
  value,
  text: i18n.t(`registration:resource_type.content_types.${value}`),
}));

export const chapterContentTypes: ContentTypeOption[] = Object.values(ChapterContentType).map((value) => ({
  value,
  text: i18n.t(`registration:resource_type.content_types.${value}`),
}));

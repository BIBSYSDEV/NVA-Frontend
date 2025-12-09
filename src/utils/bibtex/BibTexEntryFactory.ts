import {
  ArtisticType,
  BookType,
  ChapterType,
  DegreeType,
  ExhibitionContentType,
  JournalType,
  MediaType,
  OtherRegistrationType,
  PresentationType,
  ReportType,
  ResearchDataType,
} from '../../types/publicationFieldNames';
import { RegistrationSearchItem } from '../../types/registration.types';
import { BibTeXEntry, BibTeXType } from 'bibtex-generator';

/*
 * The return type of registrationSearch does not currently include all information we need.
 * If we use non-versioned accept-header, we do get all info we need, but versioning should be made
 * mandatory in the future. Backend might have to adjust the search response to include all required
 * fields for BibTex.
 * */
export function generateBibTexEntry(hit: RegistrationSearchItem, entryIdentifier: string) {
  switch (hit.type) {
    case BookType.AcademicCommentary:
    case JournalType.AcademicArticle:
    case JournalType.AcademicLiteratureReview:
    case JournalType.StudyProtocol:
    case JournalType.ProfessionalArticle:
    case JournalType.PopularScienceArticle:
    case JournalType.Corrigendum:
    case JournalType.Letter:
    case JournalType.Leader:
    case JournalType.Review:
    case MediaType.MediaFeatureArticle:
    case MediaType.MediaReaderOpinion:
      return new BibTeXEntry(BibTeXType.Article, {
        key: entryIdentifier,
        title: hit.mainTitle,
        author: generateAuthorListFromPreview(hit),
        journal: hit.publishingDetails.publisher?.name ?? 'unknown',
        year: hit.publicationDate?.year ?? 'unknown',
        doi: hit.publishingDetails.doi ?? 'unknown',
        url: hit.id,
        // month: undefined,
        // issn: undefined,
        // number: undefined,
        // pages: undefined,
        // volume: undefined,
        note: generateContextAndInstanceNote(hit),
      });
    case BookType.AcademicMonograph:
    case BookType.ExhibitionCatalog:
    case BookType.PopularScienceMonograph:
    case BookType.Encyclopedia:
    case BookType.NonFictionMonograph:
    case BookType.Textbook:
    case BookType.Anthology:
    case ReportType.BookOfAbstracts:
    case ArtisticType.LiteraryArts:
      return new BibTeXEntry(BibTeXType.Book, {
        key: entryIdentifier,
        title: hit.mainTitle,
        author: generateAuthorListFromPreview(hit),
        publisher: hit.publishingDetails.publisher?.name ?? 'unknown',
        series: hit.publishingDetails.series?.name,
        year: hit.publicationDate?.year ?? 'unknown',
        doi: hit.publishingDetails.doi ?? 'unknown',
        url: hit.id,
        // edition: undefined,
        // address: undefined,
        // month: undefined,
        // volume: undefined,
        note: generateContextAndInstanceNote(hit),
      });
    case ChapterType.AcademicChapter:
    case ChapterType.EncyclopediaChapter:
    case ChapterType.ExhibitionCatalogChapter:
    case ChapterType.Introduction:
    case ChapterType.NonFictionChapter:
    case ChapterType.PopularScienceChapter:
    case ChapterType.TextbookChapter:
    case ChapterType.ReportChapter:
      return new BibTeXEntry(BibTeXType.InBook, {
        key: entryIdentifier,
        title: hit.mainTitle,
        booktitle: 'unknown',
        chapter: 'unknown',
        author: generateAuthorListFromPreview(hit),
        publisher: hit.publishingDetails.publisher?.name ?? 'unknown',
        series: hit.publishingDetails.series?.name,
        year: hit.publicationDate?.year ?? 'unknown',
        doi: hit.publishingDetails.doi ?? 'unknown',
        url: hit.id,
        // edition: undefined,
        // address: undefined,
        // month: undefined,
        // volume: undefined,
        // editor: undefined,
        // number: undefined,
        // pages: undefined,
        note: generateContextAndInstanceNote(hit),
      });
    case ChapterType.ConferenceAbstract:
      return new BibTeXEntry(BibTeXType.InProceedings, {
        key: entryIdentifier,
        title: hit.mainTitle,
        booktitle: 'unknown',
        author: generateAuthorListFromPreview(hit),
        publisher: hit.publishingDetails.publisher?.name ?? 'unknown',
        series: hit.publishingDetails.series?.name,
        year: hit.publicationDate?.year ?? 'unknown',
        doi: hit.publishingDetails.doi ?? 'unknown',
        url: hit.id,
        // address: undefined,
        // editor: undefined,
        // month: undefined,
        // number: undefined,
        // organization: undefined,
        // pages: undefined,
        // volume: undefined,
        note: generateContextAndInstanceNote(hit),
      });
    case DegreeType.Master:
    case DegreeType.Bachelor:
    case DegreeType.Licentiate:
    case DegreeType.Other:
      return new BibTeXEntry(BibTeXType.MastersThesis, {
        key: entryIdentifier,
        title: hit.mainTitle,
        author: generateAuthorListFromPreview(hit),
        year: hit.publicationDate?.year ?? 'unknown',
        doi: hit.publishingDetails.doi ?? 'unknown',
        school: hit.publishingDetails.publisher?.name ?? 'unknown',
        type: hit.type.toString(),
        url: hit.id,
        // address: undefined,
        // month: undefined,
        note: generateContextAndInstanceNote(hit),
      });
    case DegreeType.Phd:
    case DegreeType.ArtisticPhd:
      return new BibTeXEntry(BibTeXType.PhdThesis, {
        key: entryIdentifier,
        title: hit.mainTitle,
        author: generateAuthorListFromPreview(hit),
        year: hit.publicationDate?.year ?? 'unknown',
        doi: hit.publishingDetails.doi ?? 'unknown',
        school: hit.publishingDetails.publisher?.name ?? 'unknown',
        type: hit.type.toString(),
        url: hit.id,
        // address: undefined,
        // month: undefined,
        note: generateContextAndInstanceNote(hit),
      });
    case JournalType.CaseReport:
    case ReportType.Report:
    case ReportType.Policy:
    case ReportType.Research:
    case ReportType.WorkingPaper:
    case ReportType.ConferenceReport:
      return new BibTeXEntry(BibTeXType.TechReport, {
        key: entryIdentifier,
        title: hit.mainTitle,
        author: generateAuthorListFromPreview(hit),
        institution: hit.publishingDetails.publisher?.name ?? 'unknown',
        year: hit.publicationDate?.year ?? 'unknown',
        doi: hit.publishingDetails.doi ?? 'unknown',
        type: hit.type.toString(),
        url: hit.id,
        // address: undefined,
        // month: undefined,
        // number: undefined,
        note: generateContextAndInstanceNote(hit),
      });
    case ArtisticType.ArtisticArchitecture:
    case ArtisticType.ArtisticDesign:
    case ArtisticType.MovingPicture:
    case ArtisticType.PerformingArts:
    case PresentationType.ConferenceLecture:
    case PresentationType.ConferencePoster:
    case PresentationType.Lecture:
    case PresentationType.OtherPresentation:
    case JournalType.Issue:
    case MediaType.MediaBlogPost:
    case MediaType.MediaParticipationInRadioOrTv:
    case MediaType.MediaPodcast:
    case ArtisticType.MusicPerformance:
    case ResearchDataType.DataManagementPlan:
    case ResearchDataType.Dataset:
    case ArtisticType.VisualArts:
    case OtherRegistrationType.Map:
    case ExhibitionContentType.ExhibitionProduction:
    case MediaType.MediaInterview:
    case JournalType.ConferenceAbstract:
    default:
      return new BibTeXEntry(BibTeXType.Misc, {
        // Why no doi in Misc?
        key: entryIdentifier,
        title: hit.mainTitle,
        author: generateAuthorListFromPreview(hit),
        year: hit.publicationDate?.year ?? 'unknown',
        url: hit.id,
        // howpublished: undefined, // hit.publishingDetails.publisher?.name ?? 'unknown' ?
        note: generateContextAndInstanceNote(hit),
      });
  }
}

function generateAuthorListFromPreview(hit: RegistrationSearchItem) {
  const authorList = hit.contributorsPreview.map((contributor) => contributor.identity.name).join(', ');
  if (hit.contributorsPreview.length < hit.contributorsCount) {
    return authorList + ', et al.';
  }
  return authorList;
}

function generateContextAndInstanceNote(hit: RegistrationSearchItem) {
  return `ContextType: ${hit.publishingDetails.type}, InstanceType: ${hit.type}`;
}

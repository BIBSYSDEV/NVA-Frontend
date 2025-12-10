import { BibTeXEntry, BibTeXType } from 'bibtex-generator';
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

/*
 * The return type of registrationSearch does not currently include all information we need.
 * If we use non-versioned accept-header, we do get all info we need, but versioning should be made
 * mandatory in the future. Backend might have to adjust the search response to include all required
 * fields for BibTex.
 * */

export const generateBibTexEntry = (registration: RegistrationSearchItem, entryIdentifier: string) => {
  switch (registration.type) {
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
        title: registration.mainTitle,
        author: generateAuthorListFromPreview(registration),
        journal: registration.publishingDetails.publisher?.name ?? '',
        year: registration.publicationDate?.year ?? '',
        doi: registration.publishingDetails.doi ?? '',
        url: registration.id,
        note: generateContextAndInstanceNote(registration),
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
        title: registration.mainTitle,
        author: generateAuthorListFromPreview(registration),
        publisher: registration.publishingDetails.publisher?.name ?? '',
        series: registration.publishingDetails.series?.name ?? '',
        year: registration.publicationDate?.year ?? '',
        doi: registration.publishingDetails.doi ?? '',
        url: registration.id,
        note: generateContextAndInstanceNote(registration),
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
        title: registration.mainTitle,
        booktitle: '',
        chapter: '',
        author: generateAuthorListFromPreview(registration),
        publisher: registration.publishingDetails.publisher?.name ?? '',
        series: registration.publishingDetails.series?.name ?? '',
        year: registration.publicationDate?.year ?? '',
        doi: registration.publishingDetails.doi ?? '',
        url: registration.id,
        note: generateContextAndInstanceNote(registration),
      });
    case ChapterType.ConferenceAbstract:
      return new BibTeXEntry(BibTeXType.InProceedings, {
        key: entryIdentifier,
        title: registration.mainTitle,
        booktitle: '',
        author: generateAuthorListFromPreview(registration),
        publisher: registration.publishingDetails.publisher?.name ?? '',
        series: registration.publishingDetails.series?.name ?? '',
        year: registration.publicationDate?.year ?? '',
        doi: registration.publishingDetails.doi ?? '',
        url: registration.id,
        note: generateContextAndInstanceNote(registration),
      });
    case DegreeType.Master:
    case DegreeType.Bachelor:
    case DegreeType.Licentiate:
    case DegreeType.Other:
      return new BibTeXEntry(BibTeXType.MastersThesis, {
        key: entryIdentifier,
        title: registration.mainTitle,
        author: generateAuthorListFromPreview(registration),
        year: registration.publicationDate?.year ?? '',
        doi: registration.publishingDetails.doi ?? '',
        url: registration.id,
        school: registration.publishingDetails.publisher?.name ?? '',
        type: registration.type.toString(),
      });
    case DegreeType.Phd:
    case DegreeType.ArtisticPhd:
      return new BibTeXEntry(BibTeXType.PhdThesis, {
        key: entryIdentifier,
        title: registration.mainTitle,
        author: generateAuthorListFromPreview(registration),
        year: registration.publicationDate?.year ?? '',
        doi: registration.publishingDetails.doi ?? '',
        url: registration.id,
        school: registration.publishingDetails.publisher?.name ?? '',
        type: registration.type.toString(),
        note: generateContextAndInstanceNote(registration),
      });
    case JournalType.CaseReport:
    case ReportType.Report:
    case ReportType.Policy:
    case ReportType.Research:
    case ReportType.WorkingPaper:
    case ReportType.ConferenceReport:
      return new BibTeXEntry(BibTeXType.TechReport, {
        key: entryIdentifier,
        title: registration.mainTitle,
        author: generateAuthorListFromPreview(registration),
        institution: registration.publishingDetails.publisher?.name ?? '',
        doi: registration.publishingDetails.doi ?? '',
        url: registration.id,
        year: registration.publicationDate?.year ?? '',
        type: registration.type.toString(),
        note: generateContextAndInstanceNote(registration),
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
        key: entryIdentifier,
        title: registration.mainTitle,
        author: generateAuthorListFromPreview(registration),
        year: registration.publicationDate?.year ?? '',
        doi: registration.publishingDetails.doi ?? '',
        url: registration.id,
        note: generateContextAndInstanceNote(registration),
      });
  }
};

const generateAuthorListFromPreview = (registration: RegistrationSearchItem) => {
  const authorList = registration.contributorsPreview.map((contributor) => contributor.identity.name).join(' AND ');
  if (registration.contributorsPreview.length < registration.contributorsCount) {
    return authorList + ', et al.';
  }
  return authorList;
};

const generateContextAndInstanceNote = (registration: RegistrationSearchItem) => {
  return `ContextType: ${registration.publishingDetails.type}, InstanceType: ${registration.type}`;
};

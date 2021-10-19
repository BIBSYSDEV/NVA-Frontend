import * as Yup from 'yup';
import { parse as parseIsbn } from 'isbn-utils';
import { BookType, ChapterType, DegreeType, JournalType, ReportType } from '../../../types/publicationFieldNames';
import i18n from '../../../translations/i18n';
import {
  BookMonographContentType,
  ChapterContentType,
  JournalArticleContentType,
  nviApplicableContentTypes,
} from '../../../types/publication_types/content.types';

const resourceErrorMessage = {
  contentTypeRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('registration:resource_type.content'),
  }),
  corrigendumForRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('registration:resource_type.original_article'),
  }),
  corrigendumForInvalid: i18n.t('feedback:validation.has_invalid_format', {
    field: i18n.t('registration:resource_type.original_article'),
  }),
  doiInvalid: i18n.t('feedback:validation.has_invalid_format', {
    field: i18n.t('registration:registration.link_to_resource'),
  }),
  isbnInvalid: i18n.t('feedback:validation.has_invalid_format', {
    field: i18n.t('registration:resource_type.isbn'),
  }),
  isbnTooShort: i18n.t('feedback:validation.isbn_too_short'),
  journalNotSelected: i18n.t('feedback:validation.not_selected', {
    field: i18n.t('registration:resource_type.journal'),
  }),
  journalRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('registration:resource_type.journal'),
  }),
  pageBeginMustBeSmallerThanEnd: i18n.t('feedback:validation.must_be_smaller_than', {
    field: i18n.t('registration:resource_type.pages_from'),
    limit: i18n.t('registration:resource_type.pages_to'),
  }),
  pageEndMustBeBiggerThanBegin: i18n.t('feedback:validation.must_be_bigger_than', {
    field: i18n.t('registration:resource_type.pages_to'),
    limit: i18n.t('registration:resource_type.pages_from'),
  }),
  pagesInvalid: i18n.t('feedback:validation.has_invalid_format', {
    field: i18n.t('registration:resource_type.number_of_pages'),
  }),
  pagesMustBeBigger: i18n.t('feedback:validation.must_be_bigger_than', {
    field: i18n.t('registration:resource_type.number_of_pages'),
    limit: 1,
  }),
  partOfRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('registration:resource_type.chapter.published_in'),
  }),
  peerReviewedRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('registration:resource_type.peer_reviewed'),
  }),
  publisherNotSelected: i18n.t('feedback:validation.not_selected', {
    field: i18n.t('common:publisher'),
  }),
  publisherRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('common:publisher'),
  }),
  seriesNotSelected: i18n.t('feedback:validation.not_selected', {
    field: i18n.t('registration:resource_type.series'),
  }),
  typeRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('common:type'),
  }),
};

export const emptyStringToNull = (value: string, originalValue: string) => (originalValue === '' ? null : value);

// Common Fields
const isbnListField = Yup.array().of(
  Yup.string()
    .min(13, resourceErrorMessage.isbnTooShort)
    .test('isbn-test', resourceErrorMessage.isbnInvalid, (isbn) => !!parseIsbn(isbn ?? '')?.isIsbn13())
);

const peerReviewedField = Yup.boolean()
  .nullable()
  .when('$contentType', {
    is: (contentType: string) => nviApplicableContentTypes.includes(contentType),
    then: Yup.boolean().nullable().required(resourceErrorMessage.peerReviewedRequired),
  });

const pagesMonographField = Yup.object()
  .nullable()
  .shape({
    pages: Yup.number()
      .typeError(resourceErrorMessage.pagesInvalid)
      .min(1, resourceErrorMessage.pagesMustBeBigger)
      .transform(emptyStringToNull)
      .nullable(),
  });

const pagesRangeField = Yup.object()
  .nullable()
  .shape({
    begin: Yup.string()
      .nullable()
      .test('begin-test', resourceErrorMessage.pageBeginMustBeSmallerThanEnd, (beginValue, context) => {
        const beginNumber = parseInt(beginValue ?? '');
        const endNumber = parseInt(context.parent.end);
        if (!isNaN(beginNumber) && !isNaN(endNumber)) {
          return beginNumber <= endNumber;
        }
        return true;
      }),
    end: Yup.string()
      .nullable()
      .test('end-test', resourceErrorMessage.pageEndMustBeBiggerThanBegin, (endValue, context) => {
        const beginNumber = parseInt(context.parent.begin);
        const endNumber = parseInt(endValue ?? '');
        if (!isNaN(beginNumber) && !isNaN(endNumber)) {
          return beginNumber <= endNumber;
        }
        return true;
      }),
  });

const publisherField = Yup.object().shape({
  id: Yup.string().when('name', {
    is: (value: string) => !!value,
    then: Yup.string().required(resourceErrorMessage.publisherNotSelected),
    otherwise: Yup.string().required(resourceErrorMessage.publisherRequired),
  }),
});

const seriesField = Yup.object().shape({
  id: Yup.string().when('title', {
    is: (value: string) => !!value,
    then: Yup.string().required(resourceErrorMessage.seriesNotSelected),
    otherwise: Yup.string(),
  }),
});

export const baseReference = Yup.object()
  .shape({
    doi: Yup.string().nullable().trim().url(resourceErrorMessage.doiInvalid),
    publicationInstance: Yup.object().shape({
      type: Yup.string().required(resourceErrorMessage.typeRequired),
    }),
  })
  .nullable()
  .required(resourceErrorMessage.typeRequired);

// Journal
const journalPublicationInstance = Yup.object().shape({
  type: Yup.string().oneOf(Object.values(JournalType)).required(resourceErrorMessage.typeRequired),
  articleNumber: Yup.string().nullable(),
  volume: Yup.string().nullable(),
  issue: Yup.string().nullable(),
  pages: pagesRangeField,
  corrigendumFor: Yup.string()
    .nullable()
    .when('type', {
      is: JournalType.Corrigendum,
      then: Yup.string()
        .url(resourceErrorMessage.corrigendumForInvalid)
        .nullable()
        .required(resourceErrorMessage.corrigendumForRequired),
    }),
  contentType: Yup.string()
    .nullable()
    .when('$publicationInstanceType', {
      is: JournalType.Article,
      then: Yup.string()
        .nullable()
        .oneOf(Object.values(JournalArticleContentType), resourceErrorMessage.contentTypeRequired)
        .required(resourceErrorMessage.contentTypeRequired),
    }),
  peerReviewed: peerReviewedField,
});

const journalPublicationContext = Yup.object().shape({
  id: Yup.string().when('$publicationInstanceType', {
    is: JournalType.Corrigendum,
    then: Yup.string(),
    otherwise: Yup.string().when('title', {
      is: (value: string) => !!value,
      then: Yup.string().required(resourceErrorMessage.journalNotSelected),
      otherwise: Yup.string().required(resourceErrorMessage.journalRequired),
    }),
  }),
});

export const journalReference = baseReference.shape({
  publicationInstance: journalPublicationInstance,
  publicationContext: journalPublicationContext,
});

// Book
const bookPublicationInstance = Yup.object().shape({
  type: Yup.string().oneOf(Object.values(BookType)).required(resourceErrorMessage.typeRequired),
  pages: pagesMonographField,
  contentType: Yup.string()
    .nullable()
    .when('$publicationInstanceType', {
      is: BookType.Monograph,
      then: Yup.string()
        .nullable()
        .oneOf(Object.values(BookMonographContentType), resourceErrorMessage.contentTypeRequired)
        .required(resourceErrorMessage.contentTypeRequired),
    }),
  peerReviewed: peerReviewedField,
});

const bookPublicationContext = Yup.object().shape({
  publisher: publisherField,
  series: seriesField,
  isbnList: isbnListField,
});

export const bookReference = baseReference.shape({
  publicationInstance: bookPublicationInstance,
  publicationContext: bookPublicationContext,
});

// Report
const reportPublicationInstance = Yup.object().shape({
  type: Yup.string().oneOf(Object.values(ReportType)).required(resourceErrorMessage.typeRequired),
  pages: pagesMonographField,
});

const reportPublicationContext = Yup.object().shape({
  publisher: publisherField,
  series: seriesField,
  isbnList: isbnListField,
});

export const reportReference = baseReference.shape({
  publicationInstance: reportPublicationInstance,
  publicationContext: reportPublicationContext,
});

// Degree
const degreePublicationInstance = Yup.object().shape({
  type: Yup.string().oneOf(Object.values(DegreeType)).required(resourceErrorMessage.typeRequired),
});

const degreePublicationContext = Yup.object().shape({
  publisher: publisherField,
  series: seriesField,
});

export const degreeReference = baseReference.shape({
  publicationInstance: degreePublicationInstance,
  publicationContext: degreePublicationContext,
});

// Chapter
const chapterPublicationInstance = Yup.object().shape({
  type: Yup.string().oneOf(Object.values(ChapterType)).required(resourceErrorMessage.typeRequired),
  pages: pagesRangeField,
  contentType: Yup.string()
    .nullable()
    .when('$publicationInstanceType', {
      is: ChapterType.AnthologyChapter,
      then: Yup.string()
        .nullable()
        .oneOf(Object.values(ChapterContentType), resourceErrorMessage.contentTypeRequired)
        .required(resourceErrorMessage.contentTypeRequired),
    }),
  peerReviewed: peerReviewedField,
});

const chapterPublicationContext = Yup.object().shape({
  partOf: Yup.string().nullable().required(resourceErrorMessage.partOfRequired),
});

export const chapterReference = baseReference.shape({
  publicationInstance: chapterPublicationInstance,
  publicationContext: chapterPublicationContext,
});

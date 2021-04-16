import * as Yup from 'yup';
import {
  BookType,
  ChapterType,
  DegreeType,
  JournalType,
  PublicationType,
  ReportType,
} from '../../../types/publicationFieldNames';
import i18n from '../../../translations/i18n';

export const invalidIsbnErrorMessage = i18n.t('feedback:validation.has_invalid_format', {
  field: i18n.t('registration:resource_type.isbn'),
});

const resourceErrorMessage = {
  articleNumberInvalid: i18n.t('feedback:validation.has_invalid_format', {
    field: i18n.t('registration:resource_type.article_number'),
  }),
  articleNumberMustBeBigger: i18n.t('feedback:validation.must_be_bigger_than', {
    field: i18n.t('registration:resource_type.article_number'),
    limit: 0,
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
  issueInvalid: i18n.t('feedback:validation.has_invalid_format', {
    field: i18n.t('registration:resource_type.issue'),
  }),
  issueMustBeBigger: i18n.t('feedback:validation.must_be_bigger_than', {
    field: i18n.t('registration:resource_type.issue'),
    limit: 0,
  }),
  isbnInvalid: invalidIsbnErrorMessage,
  journalRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('registration:resource_type.journal'),
  }),
  linkedContextRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('registration:resource_type.chapter.published_in'),
  }),
  pageBeginInvalid: i18n.t('feedback:validation.has_invalid_format', {
    field: i18n.t('registration:resource_type.pages_from'),
  }),
  pageBeginMustBeBigger: i18n.t('feedback:validation.must_be_bigger_than', {
    field: i18n.t('registration:resource_type.pages_from'),
    limit: 0,
  }),
  pageBeginMustBeSmallerThanEnd: i18n.t('feedback:validation.must_be_smaller_than', {
    field: i18n.t('registration:resource_type.pages_from'),
    limit: i18n.t('registration:resource_type.pages_to'),
  }),
  pageEndInvalid: i18n.t('feedback:validation.has_invalid_format', {
    field: i18n.t('registration:resource_type.pages_to'),
  }),
  pageEndMustBeBigger: i18n.t('feedback:validation.must_be_bigger_than', {
    field: i18n.t('registration:resource_type.pages_to'),
    limit: 0,
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

  publisherRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('common:publisher'),
  }),
  typeRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('common:type'),
  }),
  volumeInvalid: i18n.t('feedback:validation.has_invalid_format', {
    field: i18n.t('registration:resource_type.volume'),
  }),
  volumeMustBeBigger: i18n.t('feedback:validation.must_be_bigger_than', {
    field: i18n.t('registration:resource_type.volume'),
    limit: 0,
  }),
};

export const emptyStringToNull = (value: string, originalValue: string) => (originalValue === '' ? null : value);
export const isbnRegex = /^(97(8|9))?\d{9}(\d|X)$/g; // ISBN without hyphens

// Common Fields
const isbnListField = Yup.array().of(Yup.string().matches(isbnRegex, resourceErrorMessage.isbnInvalid));
const peerReviewedField = Yup.boolean();
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
    begin: Yup.number()
      .typeError(resourceErrorMessage.pageBeginInvalid)
      .min(0, resourceErrorMessage.pageBeginMustBeBigger)
      .when('end', {
        is: (value: number) => value && !isNaN(value),
        then: Yup.number().max(Yup.ref('end'), resourceErrorMessage.pageBeginMustBeSmallerThanEnd),
      })
      .transform(emptyStringToNull)
      .nullable(),
    end: Yup.number()
      .typeError(resourceErrorMessage.pageEndInvalid)
      .min(Yup.ref('begin'), resourceErrorMessage.pageEndMustBeBiggerThanBegin)
      .transform(emptyStringToNull)
      .nullable(),
  });
const publisherField = Yup.string().required(resourceErrorMessage.publisherRequired);

export const baseReference = Yup.object().shape({
  doi: Yup.string().trim().url(resourceErrorMessage.doiInvalid),
  publicationContext: Yup.object().shape({
    type: Yup.string().oneOf(Object.values(PublicationType)).required(resourceErrorMessage.typeRequired),
  }),
});

// Journal
const journalPublicationInstance = Yup.object().shape({
  type: Yup.string().oneOf(Object.values(JournalType)).required(resourceErrorMessage.typeRequired),
  peerReviewed: peerReviewedField,
  articleNumber: Yup.number()
    .typeError(resourceErrorMessage.articleNumberInvalid)
    .min(0, resourceErrorMessage.articleNumberMustBeBigger)
    .transform(emptyStringToNull)
    .nullable(),
  volume: Yup.number()
    .typeError(resourceErrorMessage.volumeInvalid)
    .min(0, resourceErrorMessage.volumeMustBeBigger)
    .transform(emptyStringToNull)
    .nullable(),
  issue: Yup.number()
    .typeError(resourceErrorMessage.issueInvalid)
    .min(0, resourceErrorMessage.issueMustBeBigger)
    .transform(emptyStringToNull)
    .nullable(),
  pages: pagesRangeField,
  corrigendumFor: Yup.string()
    .optional()
    .when('type', {
      is: JournalType.CORRIGENDUM,
      then: Yup.string()
        .url(resourceErrorMessage.corrigendumForInvalid)
        .required(resourceErrorMessage.corrigendumForRequired),
    }),
});

const journalPublicationContext = Yup.object().shape({
  title: Yup.string().required(resourceErrorMessage.journalRequired),
});

export const journalReference = baseReference.shape({
  publicationInstance: journalPublicationInstance,
  publicationContext: journalPublicationContext,
});

// Book
const bookPublicationInstance = Yup.object().shape({
  type: Yup.string().oneOf(Object.values(BookType)).required(resourceErrorMessage.typeRequired),
  pages: pagesMonographField,
  peerReviewed: peerReviewedField,
});

const bookPublicationContext = Yup.object().shape({
  publisher: publisherField,
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
});

export const degreeReference = baseReference.shape({
  publicationInstance: degreePublicationInstance,
  publicationContext: degreePublicationContext,
});

// Chapter
const chapterPublicationInstance = Yup.object().shape({
  type: Yup.string().oneOf(Object.values(ChapterType)).required(resourceErrorMessage.typeRequired),
  pages: pagesRangeField,
});

const chapterPublicationContext = Yup.object().shape({
  linkedContext: Yup.string().required(resourceErrorMessage.linkedContextRequired),
});

export const chapterReference = baseReference.shape({
  publicationInstance: chapterPublicationInstance,
  publicationContext: chapterPublicationContext,
});

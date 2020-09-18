import * as Yup from 'yup';
import { PublicationType, JournalType, BookType, DegreeType, ReportType } from '../../types/publicationFieldNames';
import { LanguageValues } from '../../types/language.types';
import i18n from '../../translations/i18n';

export const ErrorMessage = {
  REQUIRED: i18n.t('publication:feedback.required_field'),
  MISSING_CONTRIBUTOR: i18n.t('publication:feedback.minimum_one_contributor'),
  MISSING_FILE: i18n.t('publication:feedback.minimum_one_file'),
  INVALID_PAGE_INTERVAL: i18n.t('publication:feedback.invalid_page_interval'),
  INVALID_FORMAT: i18n.t('publication:feedback.invalid_format'),
  MUST_BE_FUTURE: i18n.t('publication:feedback.date_must_be_in_future'),
  MUST_BE_POSITIVE: i18n.t('publication:feedback.must_be_positive'),
  MUST_BE_MIN_1: i18n.t('publication:feedback.must_be_min_1'),
};

export const isbnRegex = /^(97(8|9))?\d{9}(\d|X)$/g; // ISBN without hyphens

// Common Fields
const isbnListField = Yup.array().of(Yup.string().matches(isbnRegex, ErrorMessage.INVALID_FORMAT));
const doiField = Yup.string().trim().url(ErrorMessage.INVALID_FORMAT);
const peerReviewedField = Yup.boolean().required(ErrorMessage.REQUIRED);
const pagesMonographField = Yup.object()
  .nullable()
  .shape({
    pages: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(1, ErrorMessage.MUST_BE_MIN_1),
  });
const pagesRangeField = Yup.object()
  .nullable()
  .shape({
    begin: Yup.number()
      .typeError(ErrorMessage.INVALID_FORMAT)
      .min(0, ErrorMessage.MUST_BE_POSITIVE)
      .max(Yup.ref('end'), ErrorMessage.INVALID_PAGE_INTERVAL),
    end: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(Yup.ref('begin'), ErrorMessage.INVALID_PAGE_INTERVAL),
  });
const publisherField = Yup.string().required(ErrorMessage.REQUIRED);

// Contributor
const contributorValidationSchema = Yup.object().shape({
  correspondingAuthor: Yup.boolean(),
  email: Yup.string().when('correspondingAuthor', {
    is: true,
    then: Yup.string().email(ErrorMessage.INVALID_FORMAT).required(ErrorMessage.REQUIRED),
  }),
  sequence: Yup.number().min(0),
});

// File
const fileValidationSchema = Yup.object().shape({
  administrativeAgreement: Yup.boolean(),
  embargoDate: Yup.date()
    .nullable()
    .when('administrativeAgreement', {
      is: false,
      then: Yup.date().nullable().min(new Date(), ErrorMessage.MUST_BE_FUTURE).typeError(ErrorMessage.INVALID_FORMAT),
    }),
  publisherAuthority: Yup.boolean()
    .nullable()
    .when('administrativeAgreement', {
      is: false,
      then: Yup.boolean().required(ErrorMessage.REQUIRED),
    }),
  license: Yup.object()
    .nullable()
    .when('administrativeAgreement', {
      is: false,
      then: Yup.object().required(ErrorMessage.REQUIRED),
    }),
});

// Reference
const baseReference = Yup.object().shape({
  doi: doiField,
});

// Journal
const journalPublicationInstance = Yup.object().shape({
  type: Yup.string().oneOf(Object.values(JournalType)).required(ErrorMessage.REQUIRED),
  peerReviewed: peerReviewedField,
  articleNumber: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(0, ErrorMessage.MUST_BE_POSITIVE),
  volume: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(0, ErrorMessage.MUST_BE_POSITIVE),
  issue: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(0, ErrorMessage.MUST_BE_POSITIVE),
  pages: pagesRangeField,
});

const journalPublicationContext = Yup.object().shape({
  title: Yup.string().required(ErrorMessage.REQUIRED),
});

const journalReference = baseReference.shape({
  publicationInstance: journalPublicationInstance,
  publicationContext: journalPublicationContext,
});

// Book
const bookPublicationInstance = Yup.object().shape({
  type: Yup.string().oneOf(Object.values(BookType)).required(ErrorMessage.REQUIRED),
  pages: pagesMonographField,
  peerReviewed: peerReviewedField,
});

const bookPublicationContext = Yup.object().shape({
  publisher: publisherField,
  isbnList: isbnListField,
});

const bookReference = baseReference.shape({
  publicationInstance: bookPublicationInstance,
  publicationContext: bookPublicationContext,
});

// Report
const reportPublicationInstance = Yup.object().shape({
  type: Yup.string().oneOf(Object.values(ReportType)).required(ErrorMessage.REQUIRED),
  pages: pagesMonographField,
});

const reportPublicationContext = Yup.object().shape({
  publisher: publisherField,
  isbnList: isbnListField,
});

const reportReference = baseReference.shape({
  publicationInstance: reportPublicationInstance,
  publicationContext: reportPublicationContext,
});

// Degree
const degreePublicationInstance = Yup.object().shape({
  type: Yup.string().oneOf(Object.values(DegreeType)).required(ErrorMessage.REQUIRED),
});

const degreePublicationContext = Yup.object().shape({
  publisher: publisherField,
});

const degreeReference = baseReference.shape({
  publicationInstance: degreePublicationInstance,
  publicationContext: degreePublicationContext,
});

// Chapter
// const chapterPublicationInstance = {
//   type: Yup.string().length(0),
// };

export const publicationValidationSchema = Yup.object().shape({
  entityDescription: Yup.object().shape({
    mainTitle: Yup.string().required(ErrorMessage.REQUIRED),
    abstract: Yup.string(),
    description: Yup.string(),
    tags: Yup.array().of(Yup.string()),
    npiSubjectHeading: Yup.string(),
    date: Yup.object().shape({
      year: Yup.string(),
      month: Yup.string(),
      day: Yup.string(),
    }),
    language: Yup.string().url().oneOf(Object.values(LanguageValues)),
    projects: Yup.array().of(Yup.object()), // TODO
    contributors: Yup.array().of(contributorValidationSchema).min(1, ErrorMessage.MISSING_CONTRIBUTOR),
    reference: Yup.object()
      .when('$publicationContextType', {
        is: PublicationType.PUBLICATION_IN_JOURNAL,
        then: journalReference,
      })
      .when('$publicationContextType', {
        is: PublicationType.BOOK,
        then: bookReference,
      })
      .when('$publicationContextType', {
        is: PublicationType.REPORT,
        then: reportReference,
      })
      .when('$publicationContextType', {
        is: PublicationType.DEGREE,
        then: degreeReference,
      }),
  }),
  fileSet: Yup.object().shape({
    files: Yup.array().of(fileValidationSchema).min(1, ErrorMessage.MISSING_FILE),
  }),
});

export const doiValidationSchema = Yup.object().shape({
  doiUrl: doiField.required(ErrorMessage.REQUIRED),
});

export const newContributorValidationSchema = Yup.object().shape({
  firstName: Yup.string().required(ErrorMessage.REQUIRED),
  lastName: Yup.string().required(ErrorMessage.REQUIRED),
});

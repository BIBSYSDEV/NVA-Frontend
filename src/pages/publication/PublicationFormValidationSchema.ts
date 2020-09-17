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

const contributorValidationSchema = {
  correspondingAuthor: Yup.boolean(),
  email: Yup.string().when('correspondingAuthor', {
    is: true,
    then: Yup.string().email(ErrorMessage.INVALID_FORMAT).required(ErrorMessage.REQUIRED),
  }),
  sequence: Yup.number().min(0),
};

const fileValidationSchema = {
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
};

const journalPublicationInstance = {
  type: Yup.string().oneOf(Object.values(JournalType)).required(ErrorMessage.REQUIRED),
  peerReviewed: Yup.boolean().required(ErrorMessage.REQUIRED),
  articleNumber: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(0, ErrorMessage.MUST_BE_POSITIVE),
  volume: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(0, ErrorMessage.MUST_BE_POSITIVE),
  issue: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(0, ErrorMessage.MUST_BE_POSITIVE),
  pages: Yup.object()
    .nullable()
    .shape({
      begin: Yup.number()
        .typeError(ErrorMessage.INVALID_FORMAT)
        .min(0, ErrorMessage.MUST_BE_POSITIVE)
        .max(Yup.ref('end'), ErrorMessage.INVALID_PAGE_INTERVAL),
      end: Yup.number()
        .typeError(ErrorMessage.INVALID_FORMAT)
        .min(Yup.ref('begin'), ErrorMessage.INVALID_PAGE_INTERVAL),
    }),
};

const bookPublicationInstance = {
  type: Yup.string().oneOf(Object.values(BookType)).required(ErrorMessage.REQUIRED),
  pages: Yup.object()
    .nullable()
    .shape({
      pages: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(1, ErrorMessage.MUST_BE_MIN_1),
    }),
  peerReviewed: Yup.boolean().required(ErrorMessage.REQUIRED),
};

const bookPublicationContext = {
  isbnList: Yup.array().of(Yup.string().matches(isbnRegex)),
};

const reportPublicationInstance = {
  type: Yup.string().oneOf(Object.values(ReportType)).required(ErrorMessage.REQUIRED),
  pages: Yup.object()
    .nullable()
    .shape({
      pages: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(1, ErrorMessage.MUST_BE_MIN_1),
    }),
};

const degreePublicationInstance = {
  type: Yup.string().oneOf(Object.values(DegreeType)).required(ErrorMessage.REQUIRED),
};

// const chapterPublicationInstance = {
//   type: Yup.string().length(0),
// };

const journalPublicationContext = {
  title: Yup.string().required(ErrorMessage.REQUIRED),
};

const degreePublicationContext = {
  publisher: Yup.string().required(ErrorMessage.REQUIRED),
};

const reportPublicationContext = {
  publisher: Yup.string().required(ErrorMessage.REQUIRED),
  isbnList: Yup.array().of(Yup.string().matches(isbnRegex)),
};

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
    contributors: Yup.array()
      .of(Yup.object().shape(contributorValidationSchema))
      .min(1, ErrorMessage.MISSING_CONTRIBUTOR),
    reference: Yup.object().shape({
      doi: Yup.string(),
      publicationInstance: Yup.object()
        .when('$publicationContextType', {
          is: PublicationType.PUBLICATION_IN_JOURNAL,
          then: Yup.object().shape(journalPublicationInstance),
        })
        .when('$publicationContextType', {
          is: PublicationType.BOOK,
          then: Yup.object().shape(bookPublicationInstance),
        })
        .when('$publicationContextType', {
          is: PublicationType.REPORT,
          then: Yup.object().shape(reportPublicationInstance),
        })
        .when('$publicationContextType', {
          is: PublicationType.DEGREE,
          then: Yup.object().shape(degreePublicationInstance),
        }),
      // .when('$publicationContextType', {
      //   is: PublicationType.CHAPTER,
      //   then: Yup.object().shape(chapterPublicationInstance),
      // }),
      publicationContext: Yup.object()
        .shape({ type: Yup.string().required(ErrorMessage.REQUIRED) })
        .when('$publicationContextType', {
          is: PublicationType.PUBLICATION_IN_JOURNAL,
          then: Yup.object().shape(journalPublicationContext),
        })
        .when('$publicationContextType', {
          is: PublicationType.BOOK,
          then: Yup.object().shape(bookPublicationContext),
        })
        .when('$publicationContextType', {
          is: PublicationType.DEGREE,
          then: Yup.object().shape(degreePublicationContext),
        })
        .when('$publicationContextType', {
          is: PublicationType.REPORT,
          then: Yup.object().shape(reportPublicationContext),
        }),
    }),
  }),
  fileSet: Yup.object().shape({
    files: Yup.array().of(Yup.object().shape(fileValidationSchema)).min(1, ErrorMessage.MISSING_FILE),
  }),
});

export const doiValidationSchema = Yup.object().shape({
  doiUrl: Yup.string().trim().url(ErrorMessage.INVALID_FORMAT).required(ErrorMessage.REQUIRED),
});

export const newContributorValidationSchema = Yup.object().shape({
  firstName: Yup.string().required(ErrorMessage.REQUIRED),
  lastName: Yup.string().required(ErrorMessage.REQUIRED),
});

import * as Yup from 'yup';
import {
  PublicationType,
  JournalArticleType,
  BookType,
  DegreeType,
  ReportType,
} from '../../types/publicationFieldNames';
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

const journalValidationSchema = {
  type: Yup.string().oneOf(Object.values(JournalArticleType)).required(ErrorMessage.REQUIRED),
  peerReviewed: Yup.boolean().required(ErrorMessage.REQUIRED),
  articleNumber: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(0, ErrorMessage.MUST_BE_POSITIVE),
  volume: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(0, ErrorMessage.MUST_BE_POSITIVE),
  issue: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(0, ErrorMessage.MUST_BE_POSITIVE),
  pages: Yup.object().shape({
    begin: Yup.number()
      .typeError(ErrorMessage.INVALID_FORMAT)
      .min(0, ErrorMessage.MUST_BE_POSITIVE)
      .max(Yup.ref('end'), ErrorMessage.INVALID_PAGE_INTERVAL),
    end: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(Yup.ref('begin'), ErrorMessage.INVALID_PAGE_INTERVAL),
  }),
};

const bookValidationSchema = {
  type: Yup.string().oneOf(Object.values(BookType)).required(ErrorMessage.REQUIRED),
  isbn: Yup.string(),
  numberOfPages: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(1, ErrorMessage.MUST_BE_MIN_1),
  textBook: Yup.boolean(),
  peerReviewed: Yup.boolean().required(ErrorMessage.REQUIRED),
};

const reportValidationSchema = {
  type: Yup.string().oneOf(Object.values(ReportType)).required(ErrorMessage.REQUIRED),
  isbn: Yup.string(),
  numberOfPages: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(1, ErrorMessage.MUST_BE_MIN_1),
};

const degreeValidationSchema = {
  type: Yup.string().oneOf(Object.values(DegreeType)).required(ErrorMessage.REQUIRED),
};

const chapterValidationSchema = {
  type: Yup.string().length(0),
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
          then: Yup.object().shape(journalValidationSchema),
        })
        .when('$publicationContextType', {
          is: PublicationType.BOOK,
          then: Yup.object().shape(bookValidationSchema),
        })
        .when('$publicationContextType', {
          is: PublicationType.REPORT,
          then: Yup.object().shape(reportValidationSchema),
        })
        .when('$publicationContextType', {
          is: PublicationType.DEGREE,
          then: Yup.object().shape(degreeValidationSchema),
        })
        .when('$publicationContextType', {
          is: PublicationType.CHAPTER,
          then: Yup.object().shape(chapterValidationSchema),
        }),
      publicationContext: Yup.object().shape({
        type: Yup.string().required(ErrorMessage.REQUIRED),
        title: Yup.string().required(ErrorMessage.REQUIRED),
        level: Yup.mixed(),
        openAccess: Yup.boolean(),
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

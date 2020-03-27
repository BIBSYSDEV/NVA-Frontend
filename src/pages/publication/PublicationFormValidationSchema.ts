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

const ErrorMessage = {
  REQUIRED: i18n.t('publication:feedback.required_field'),
  MISSING_CONTRIBUTOR: i18n.t('publication:feedback.minimum_one_contributor'),
  MISSING_FILE: i18n.t('publication:feedback.minimum_one_file'),
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
    publicationType: Yup.string().oneOf(Object.values(PublicationType)).required(ErrorMessage.REQUIRED),
    publicationSubtype: Yup.string()
      .when('publicationType', {
        is: PublicationType.PUBLICATION_IN_JOURNAL,
        then: Yup.string().oneOf(Object.values(JournalArticleType)).required(ErrorMessage.REQUIRED),
      })
      .when('publicationType', {
        is: PublicationType.BOOK,
        then: Yup.string().oneOf(Object.values(BookType)).required(ErrorMessage.REQUIRED),
      })
      .when('publicationType', {
        is: PublicationType.REPORT,
        then: Yup.string().oneOf(Object.values(ReportType)).required(ErrorMessage.REQUIRED),
      })
      .when('publicationType', {
        is: PublicationType.DEGREE,
        then: Yup.string().oneOf(Object.values(DegreeType)).required(ErrorMessage.REQUIRED),
      })
      .when('publicationType', {
        is: PublicationType.CHAPTER,
        then: Yup.string().length(0),
      }),
    contributors: Yup.array()
      .of(Yup.object()) // TODO
      .min(1, ErrorMessage.MISSING_CONTRIBUTOR),
    publisher: Yup.object()
      .nullable()
      .shape({
        title: Yup.string(),
      })
      .required(ErrorMessage.REQUIRED),
    peerReview: Yup.boolean().when('publicationSubtype', {
      is: (subtype) =>
        [PublicationType.PUBLICATION_IN_JOURNAL, PublicationType.BOOK, PublicationType.REPORT].includes(subtype),
      then: Yup.boolean().required(ErrorMessage.REQUIRED),
    }),
    isbn: Yup.string(),
    numberOfPages: Yup.string(),
    series: Yup.object(),
    specialization: Yup.string(),
    textBook: Yup.boolean(),
    reference: Yup.object().shape({
      doi: Yup.string(),
      publicationInstance: Yup.object().shape({
        articleNumber: Yup.string(),
        volume: Yup.string(),
        issue: Yup.string(),
        peerReviewed: Yup.boolean(),
        pages: Yup.object().shape({
          begin: Yup.string(),
          end: Yup.string(),
        }),
      }),
      publicationContext: Yup.object()
        .nullable()
        .shape({
          name: Yup.string(),
          level: Yup.number(),
          openAccess: Yup.boolean(),
        })
        .required(ErrorMessage.REQUIRED),
    }),
  }),
  fileSet: Yup.array()
    .of(
      Yup.object().shape({
        administrativeAgreement: Yup.boolean(),
        embargoDate: Yup.date()
          .nullable()
          .when('administrativeAgreement', {
            is: false,
            then: Yup.date().nullable().min(new Date()).required(ErrorMessage.REQUIRED),
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
      })
    )
    .min(1, ErrorMessage.MISSING_FILE),
});

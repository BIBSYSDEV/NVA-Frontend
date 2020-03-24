import * as Yup from 'yup';
import { ReferenceType, JournalArticleType, BookType, DegreeType, ReportType } from '../../types/references.types';
import { LanguageCodes } from '../../types/language.types';
import i18n from '../../translations/i18n';

export const publicationValidationSchema = Yup.object().shape({
  entityDescription: Yup.object().shape({
    mainTitle: Yup.string().required(i18n.t('publication:feedback.required_field')),
    abstract: Yup.string(),
    description: Yup.string(),
    tags: Yup.array().of(Yup.string()),
    npiSubjectHeading: Yup.string(),
    date: Yup.object().shape({
      year: Yup.string(),
      month: Yup.string(),
      day: Yup.string(),
    }),
    language: Yup.string().oneOf(Object.values(LanguageCodes)),
    projects: Yup.array().of(Yup.object()), // TODO
    publicationType: Yup.string()
      .oneOf(Object.values(ReferenceType))
      .required(i18n.t('publication:feedback.required_field')),
    publicationSubtype: Yup.string()
      .when('publicationType', {
        is: ReferenceType.PUBLICATION_IN_JOURNAL,
        then: Yup.string()
          .oneOf(Object.values(JournalArticleType))
          .required(i18n.t('publication:feedback.required_field')),
      })
      .when('publicationType', {
        is: ReferenceType.BOOK,
        then: Yup.string().oneOf(Object.values(BookType)).required(i18n.t('publication:feedback.required_field')),
      })
      .when('publicationType', {
        is: ReferenceType.REPORT,
        then: Yup.string().oneOf(Object.values(ReportType)).required(i18n.t('publication:feedback.required_field')),
      })
      .when('publicationType', {
        is: ReferenceType.DEGREE,
        then: Yup.string().oneOf(Object.values(DegreeType)).required(i18n.t('publication:feedback.required_field')),
      })
      .when('publicationType', {
        is: ReferenceType.CHAPTER,
        then: Yup.string().length(0),
      }),
    contributors: Yup.array()
      .of(Yup.object()) // TODO
      .min(1, i18n.t('publication:feedback.minimum_one_contributor')),
    publisher: Yup.object()
      .nullable()
      .shape({
        title: Yup.string(),
      })
      .required(i18n.t('publication:feedback.required_field')),
    peerReview: Yup.boolean().when('publicationSubtype', {
      is: (subtype) =>
        [ReferenceType.PUBLICATION_IN_JOURNAL, ReferenceType.BOOK, ReferenceType.REPORT].includes(subtype),
      then: Yup.boolean().required(i18n.t('publication:feedback.required_field')),
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
        // peerReviewed: Yup.boolean(),
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
        .required(i18n.t('publication:feedback.required_field')),
    }),
  }),
  fileSet: Yup.array().of(Yup.object()), // TODO
});

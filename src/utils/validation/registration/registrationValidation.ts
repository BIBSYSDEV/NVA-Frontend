import * as Yup from 'yup';
import { PublicationType } from '../../../types/publicationFieldNames';
import { contributorsValidationSchema } from './contributorValidation';
import { fileValidationSchema } from './fileValidation';
import {
  artisticDesignReference,
  baseReference,
  bookReference,
  chapterReference,
  degreeReference,
  emptyStringToNull,
  journalReference,
  presentationReference,
  reportReference,
} from './referenceValidation';
import i18n from '../../../translations/i18n';
import { getMainRegistrationType, isBook } from '../../registration-helpers';

const registrationErrorMessage = {
  titleRequired: i18n.t('feedback:validation.is_required', { field: i18n.t('common:title') }),
  npiSubjectRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('registration:description.npi_disciplines'),
  }),
  publishedDateRequired: i18n.t('feedback:validation.is_required', {
    field: i18n.t('registration:description.date_published'),
  }),
  publishedDateInvalid: i18n.t('feedback:validation.has_invalid_format', {
    field: i18n.t('registration:description.date_published'),
  }),
  fileRequired: i18n.t('feedback:validation.minimum_one_file'),
};

export const registrationValidationSchema = Yup.object().shape({
  entityDescription: Yup.object().shape({
    mainTitle: Yup.string().nullable().required(registrationErrorMessage.titleRequired),
    abstract: Yup.string().nullable(),
    description: Yup.string().nullable(),
    tags: Yup.array().of(Yup.string()),
    npiSubjectHeading: Yup.string().when('$publicationInstanceType', (publicationInstanceType) =>
      isBook(publicationInstanceType)
        ? Yup.string().nullable().required(registrationErrorMessage.npiSubjectRequired)
        : Yup.string().nullable()
    ),
    date: Yup.object().shape({
      year: Yup.number()
        .typeError(registrationErrorMessage.publishedDateInvalid)
        .required(registrationErrorMessage.publishedDateRequired),
      month: Yup.number().transform(emptyStringToNull).nullable(),
      day: Yup.number().transform(emptyStringToNull).nullable(),
    }),
    language: Yup.string().nullable(),
    projects: Yup.array().of(Yup.object()),
    contributors: contributorsValidationSchema,
    reference: Yup.object().when('$publicationInstanceType', (publicationInstanceType) => {
      const mainType = getMainRegistrationType(publicationInstanceType);
      switch (mainType) {
        case PublicationType.PublicationInJournal:
          return journalReference;
        case PublicationType.Book:
          return bookReference;
        case PublicationType.Report:
          return reportReference;
        case PublicationType.Degree:
          return degreeReference;
        case PublicationType.Chapter:
          return chapterReference;
        case PublicationType.Presentation:
          return presentationReference;
        case PublicationType.Artistic:
          return artisticDesignReference;
        default:
          return baseReference;
      }
    }),
  }),
  fileSet: Yup.object().shape({
    files: Yup.array()
      .of(fileValidationSchema)
      .min(1, registrationErrorMessage.fileRequired)
      .required(registrationErrorMessage.fileRequired),
  }),
});

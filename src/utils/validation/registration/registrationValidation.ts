import * as Yup from 'yup';
import i18n from '../../../translations/i18n';
import { PublicationType } from '../../../types/publicationFieldNames';
import { EntityDescription, Registration, RegistrationDate } from '../../../types/registration.types';
import { getMainRegistrationType, isBook, isChapter } from '../../registration-helpers';
import { YupShape } from '../validationHelpers';
import { associatedFileValidationSchema } from './associatedArtifactValidation';
import { contributorsValidationSchema } from './contributorValidation';
import { fundingValidationSchema } from './fundingValidation';
import {
  artisticDesignReference,
  baseReference,
  bookReference,
  chapterReference,
  degreeReference,
  emptyStringToNull,
  exhibitionProductionReference,
  journalReference,
  mapReference,
  mediaContributionReference,
  presentationReference,
  reportReference,
  researchDataReference,
} from './referenceValidation';

const registrationErrorMessage = {
  titleRequired: i18n.t('feedback.validation.is_required', { field: i18n.t('common.title') }),
  npiSubjectRequired: i18n.t('feedback.validation.is_required', {
    field: i18n.t('registration.description.npi_disciplines'),
  }),
  publishedDateRequired: i18n.t('feedback.validation.is_required', {
    field: i18n.t('registration.description.date_published'),
  }),
  publishedDateInvalid: i18n.t('feedback.validation.has_invalid_format', {
    field: i18n.t('registration.description.date_published'),
  }),
};

export const registrationValidationSchema = Yup.object<YupShape<Registration>>({
  entityDescription: Yup.object<YupShape<EntityDescription>>({
    mainTitle: Yup.string().nullable().required(registrationErrorMessage.titleRequired),
    abstract: Yup.string().nullable(),
    description: Yup.string().nullable(),
    tags: Yup.array().of(Yup.string()),
    npiSubjectHeading: Yup.string()
      .nullable()
      .when('$publicationInstanceType', ([publicationInstanceType], schema) =>
        isBook(publicationInstanceType) || isChapter(publicationInstanceType)
          ? schema.required(registrationErrorMessage.npiSubjectRequired)
          : schema
      ),
    publicationDate: Yup.object<YupShape<RegistrationDate>>({
      year: Yup.number()
        .typeError(registrationErrorMessage.publishedDateInvalid)
        .required(registrationErrorMessage.publishedDateRequired),
      month: Yup.number().transform(emptyStringToNull).nullable(),
      day: Yup.number().transform(emptyStringToNull).nullable(),
    }),
    language: Yup.string().nullable(),
    contributors: contributorsValidationSchema,
    reference: Yup.object().when('$publicationInstanceType', ([publicationInstanceType]) => {
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
        case PublicationType.Anthology:
          return chapterReference;
        case PublicationType.Presentation:
          return presentationReference;
        case PublicationType.Artistic:
          return artisticDesignReference;
        case PublicationType.MediaContribution:
          return mediaContributionReference;
        case PublicationType.ResearchData:
          return researchDataReference;
        case PublicationType.GeographicalContent:
          return mapReference;
        case PublicationType.ExhibitionContent:
          return exhibitionProductionReference;
        default:
          return baseReference;
      }
    }),
  }),
  projects: Yup.array().of(Yup.object()),
  associatedArtifacts: Yup.array().of(associatedFileValidationSchema),
  fundings: Yup.array().of(fundingValidationSchema),
});

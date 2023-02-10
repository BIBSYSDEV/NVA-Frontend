import * as Yup from 'yup';
import { PublicationType } from '../../../types/publicationFieldNames';
import { contributorsValidationSchema } from './contributorValidation';
import { associatedFileValidationSchema } from './associatedArtifactValidation';
import {
  artisticDesignReference,
  baseReference,
  bookReference,
  chapterReference,
  degreeReference,
  emptyStringToNull,
  journalReference,
  mapReference,
  mediaContributionReference,
  presentationReference,
  reportReference,
  researchDataReference,
} from './referenceValidation';
import i18n from '../../../translations/i18n';
import { getMainRegistrationType, isBook } from '../../registration-helpers';
import { Registration, EntityDescription, RegistrationDate } from '../../../types/registration.types';
import { YupShape } from '../validationHelpers';
import { fundingValidationSchema } from './fundingValidation';

const registrationErrorMessage = {
  titleRequired: i18n.t('translation:feedback.validation.is_required', { field: i18n.t('translation:common.title') }),
  npiSubjectRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:registration.description.npi_disciplines'),
  }),
  publishedDateRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:registration.description.date_published'),
  }),
  publishedDateInvalid: i18n.t('translation:feedback.validation.has_invalid_format', {
    field: i18n.t('translation:registration.description.date_published'),
  }),
  associatedArtifactRequired: i18n.t('translation:feedback.validation.must_have_associated_artifact'),
};

export const registrationValidationSchema = Yup.object<YupShape<Registration>>({
  entityDescription: Yup.object<YupShape<EntityDescription>>({
    mainTitle: Yup.string().nullable().required(registrationErrorMessage.titleRequired),
    abstract: Yup.string().nullable(),
    description: Yup.string().nullable(),
    tags: Yup.array().of(Yup.string()),
    npiSubjectHeading: Yup.string().when('$publicationInstanceType', (publicationInstanceType) =>
      isBook(publicationInstanceType)
        ? Yup.string().nullable().required(registrationErrorMessage.npiSubjectRequired)
        : Yup.string().nullable()
    ),
    date: Yup.object<YupShape<RegistrationDate>>({
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
        case PublicationType.Chapter:
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
        default:
          return baseReference;
      }
    }),
  }),
  associatedArtifacts: Yup.array()
    .of(associatedFileValidationSchema)
    .when('entityDescription', ([entityDescription]: EntityDescription[], schema) =>
      entityDescription.reference?.doi
        ? schema.min(0)
        : schema.min(1, registrationErrorMessage.associatedArtifactRequired)
    )
    .required(registrationErrorMessage.associatedArtifactRequired),
  projects: Yup.array().of(Yup.object()),
  fundings: Yup.array().of(fundingValidationSchema),
});

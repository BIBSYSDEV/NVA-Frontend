import * as Yup from 'yup';
import { PublicationType } from '../../../types/publicationFieldNames';
import { LanguageValues } from '../../../types/language.types';
import { ErrorMessage } from '../errorMessage';
import { contributorValidationSchema } from './contributorValidation';
import {
  journalReference,
  bookReference,
  reportReference,
  degreeReference,
  baseReference,
} from './referenceValidation';
import { fileValidationSchema } from './fileValidation';

export const registrationValidationSchema = Yup.object().shape({
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
    reference: baseReference
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

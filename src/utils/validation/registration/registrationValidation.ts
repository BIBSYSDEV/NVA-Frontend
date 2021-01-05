import * as Yup from 'yup';
import { LanguageValues } from '../../../types/language.types';
import { PublicationType } from '../../../types/publicationFieldNames';
import { ErrorMessage } from '../errorMessage';
import { contributorValidationSchema } from './contributorValidation';
import { fileValidationSchema } from './fileValidation';
import {
  baseReference,
  bookReference,
  degreeReference,
  journalReference,
  reportReference,
} from './referenceValidation';

export const registrationValidationSchema = Yup.object().shape({
  entityDescription: Yup.object().shape({
    mainTitle: Yup.string().required(ErrorMessage.REQUIRED),
    abstract: Yup.string(),
    description: Yup.string(),
    tags: Yup.array().of(Yup.string()),
    npiSubjectHeading: Yup.string(),
    date: Yup.object().shape({
      year: Yup.number().required(ErrorMessage.REQUIRED),
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

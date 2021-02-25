import * as Yup from 'yup';
import { LanguageValues } from '../../../types/language.types';
import { BookType, PublicationType } from '../../../types/publicationFieldNames';
import { ErrorMessage } from '../errorMessage';
import { contributorValidationSchema } from './contributorValidation';
import { fileValidationSchema } from './fileValidation';
import {
  baseReference,
  bookReference,
  chapterReference,
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
      month: Yup.number()
        .nullable()
        .transform((value: string, originalValue: string) => (originalValue === '' ? null : value)),
      day: Yup.number()
        .nullable()
        .transform((value: string, originalValue: string) => (originalValue === '' ? null : value)),
    }),
    language: Yup.string().url().oneOf(Object.values(LanguageValues)),
    projects: Yup.array().of(Yup.object()), // TODO
    contributors: Yup.array()
      .when('$publicationInstanceType', {
        is: BookType.ANTHOLOGY,
        then: Yup.array().of(contributorValidationSchema).min(1, ErrorMessage.MISSING_EDITOR),
        otherwise: Yup.array().of(contributorValidationSchema).min(1, ErrorMessage.MISSING_AUTHOR),
      })
      .when('$publicationContextType', {
        is: PublicationType.DEGREE,
        then: Yup.array().of(contributorValidationSchema).min(1, ErrorMessage.MISSING_SUPERVISOR),
      }),
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
      })
      .when('$publicationContextType', {
        is: PublicationType.CHAPTER,
        then: chapterReference,
      }),
  }),
  fileSet: Yup.object().shape({
    files: Yup.array().of(fileValidationSchema).min(1, ErrorMessage.MISSING_FILE),
  }),
});

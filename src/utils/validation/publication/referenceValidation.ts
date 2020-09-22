import * as Yup from 'yup';
import { ErrorMessage } from '../errorMessage';
import { JournalType, BookType, ReportType, DegreeType, PublicationType } from '../../../types/publicationFieldNames';

export const isbnRegex = /^(97(8|9))?\d{9}(\d|X)$/g; // ISBN without hyphens

// Common Fields
const isbnListField = Yup.array().of(Yup.string().matches(isbnRegex, ErrorMessage.INVALID_ISBN));
const peerReviewedField = Yup.boolean().required(ErrorMessage.REQUIRED);
const pagesMonographField = Yup.object()
  .nullable()
  .shape({
    pages: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(1, ErrorMessage.MUST_BE_MIN_1),
  });
const pagesRangeField = Yup.object()
  .nullable()
  .shape({
    begin: Yup.number()
      .typeError(ErrorMessage.INVALID_FORMAT)
      .min(0, ErrorMessage.MUST_BE_POSITIVE)
      .max(Yup.ref('end'), ErrorMessage.INVALID_PAGE_INTERVAL),
    end: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(Yup.ref('begin'), ErrorMessage.INVALID_PAGE_INTERVAL),
  });
const publisherField = Yup.string().required(ErrorMessage.REQUIRED);

export const baseReference = Yup.object().shape({
  doi: Yup.string().trim().url(ErrorMessage.INVALID_FORMAT),
  publicationContext: Yup.object().shape({
    type: Yup.string().oneOf(Object.values(PublicationType)).required(ErrorMessage.REQUIRED),
  }),
});

// Journal
const journalPublicationInstance = Yup.object().shape({
  type: Yup.string().oneOf(Object.values(JournalType)).required(ErrorMessage.REQUIRED),
  peerReviewed: peerReviewedField,
  articleNumber: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(0, ErrorMessage.MUST_BE_POSITIVE),
  volume: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(0, ErrorMessage.MUST_BE_POSITIVE),
  issue: Yup.number().typeError(ErrorMessage.INVALID_FORMAT).min(0, ErrorMessage.MUST_BE_POSITIVE),
  pages: pagesRangeField,
});

const journalPublicationContext = Yup.object().shape({
  title: Yup.string().required(ErrorMessage.REQUIRED),
});

export const journalReference = baseReference.shape({
  publicationInstance: journalPublicationInstance,
  publicationContext: journalPublicationContext,
});

// Book
const bookPublicationInstance = Yup.object().shape({
  type: Yup.string().oneOf(Object.values(BookType)).required(ErrorMessage.REQUIRED),
  pages: pagesMonographField,
  peerReviewed: peerReviewedField,
});

const bookPublicationContext = Yup.object().shape({
  publisher: publisherField,
  isbnList: isbnListField,
});

export const bookReference = baseReference.shape({
  publicationInstance: bookPublicationInstance,
  publicationContext: bookPublicationContext,
});

// Report
const reportPublicationInstance = Yup.object().shape({
  type: Yup.string().oneOf(Object.values(ReportType)).required(ErrorMessage.REQUIRED),
  pages: pagesMonographField,
});

const reportPublicationContext = Yup.object().shape({
  publisher: publisherField,
  isbnList: isbnListField,
});

export const reportReference = baseReference.shape({
  publicationInstance: reportPublicationInstance,
  publicationContext: reportPublicationContext,
});

// Degree
const degreePublicationInstance = Yup.object().shape({
  type: Yup.string().oneOf(Object.values(DegreeType)).required(ErrorMessage.REQUIRED),
});

const degreePublicationContext = Yup.object().shape({
  publisher: publisherField,
});

export const degreeReference = baseReference.shape({
  publicationInstance: degreePublicationInstance,
  publicationContext: degreePublicationContext,
});

import {
  ContributorsFormData,
  DescriptionFormData,
  BookReferenceFormData,
  JournalPublicationReferenceFormData,
} from '../../types/form.types';

export const UPDATE_DESCRIPTION_FORM_DATA = 'update description form data';
export const UPDATE_CONTRIBUTORS_FORM_DATA = 'update contributors form data';
export const UPDATE_JOURNAL_PUBLICATIONS_FORM_DATA = 'update journal publication reference form data';
export const UPDATE_BOOK_FORM_DATA = 'update book reference form data';

export const updateDescriptionFormData = (descriptionData: DescriptionFormData): UpdateDescriptionFormData => ({
  type: UPDATE_DESCRIPTION_FORM_DATA,
  descriptionData,
});

export const updateContributorsFormData = (contributorsData: ContributorsFormData): UpdateContributorsFormData => ({
  type: UPDATE_CONTRIBUTORS_FORM_DATA,
  contributorsData,
});

export const updateJournalPublicationReferenceFormData = (
  journalPublicationReferenceData: JournalPublicationReferenceFormData
): UpdateJournalPublicationReferenceData => ({
  type: UPDATE_JOURNAL_PUBLICATIONS_FORM_DATA,
  journalPublicationReferenceData,
});

export const updateBookReferenceFormData = (bookReferenceData: BookReferenceFormData): UpdateBookReferenceData => ({
  type: UPDATE_BOOK_FORM_DATA,
  bookReferenceData,
});

interface UpdateDescriptionFormData {
  type: typeof UPDATE_DESCRIPTION_FORM_DATA;
  descriptionData: DescriptionFormData;
}

interface UpdateContributorsFormData {
  type: typeof UPDATE_CONTRIBUTORS_FORM_DATA;
  contributorsData: ContributorsFormData;
}

interface UpdateBookReferenceData {
  type: typeof UPDATE_BOOK_FORM_DATA;
  bookReferenceData: BookReferenceFormData;
}

interface UpdateJournalPublicationReferenceData {
  type: typeof UPDATE_JOURNAL_PUBLICATIONS_FORM_DATA;
  journalPublicationReferenceData: JournalPublicationReferenceFormData;
}

export type FormActions =
  | UpdateDescriptionFormData
  | UpdateContributorsFormData
  | UpdateBookReferenceData
  | UpdateJournalPublicationReferenceData;

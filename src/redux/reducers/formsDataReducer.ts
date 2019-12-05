import { emptyForms, FormsData } from '../../types/form.types';
import {
  FormActions,
  UPDATE_CONTRIBUTORS_FORM_DATA,
  UPDATE_DESCRIPTION_FORM_DATA,
  UPDATE_BOOK_FORM_DATA,
  UPDATE_JOURNAL_PUBLICATIONS_FORM_DATA,
} from '../actions/formsDataActions';

export const formsDataReducer = (state: FormsData = emptyForms, action: FormActions) => {
  switch (action.type) {
    case UPDATE_DESCRIPTION_FORM_DATA:
      return {
        ...state,
        publicationDescription: action.descriptionData,
      };
    case UPDATE_CONTRIBUTORS_FORM_DATA:
      return {
        ...state,
        publicationContributors: action.contributorsData,
      };
    case UPDATE_BOOK_FORM_DATA:
      return {
        ...state,
        publicationBookReference: action.bookReferenceData,
      };
    case UPDATE_JOURNAL_PUBLICATIONS_FORM_DATA:
      return {
        ...state,
        publicationJournalPublicationReference: action.journalPublicationReferenceData,
      };
    default:
      return state;
  }
};

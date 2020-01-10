import { Publication } from '../../types/publication.types';
import { PublicationActions, GET_PUBLICATIONS_SUCCESS } from '../actions/publicationActions';

export const publicationReducer = (state: Publication[] = [], action: PublicationActions) => {
  switch (action.type) {
    case GET_PUBLICATIONS_SUCCESS:
      return action.publications;
    default:
      return state;
  }
};

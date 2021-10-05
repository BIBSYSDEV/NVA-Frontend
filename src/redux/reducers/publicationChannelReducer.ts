import { PublicationChannelActions, SET_PUBLICATION_CHANNEL } from '../actions/publicationChannelActions';

export const publicationChannelReducer = (state = {}, action: PublicationChannelActions) => {
  switch (action.type) {
    case SET_PUBLICATION_CHANNEL:
      return { ...state, [action.publicationChannel.id]: action.publicationChannel };
    default:
      return state;
  }
};

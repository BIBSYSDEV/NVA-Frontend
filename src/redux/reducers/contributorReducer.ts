import ContributorType, { Direction } from '../../types/contributor.types';
import {
    ADD_CONTRIBUTOR, ContributorActions, MOVE_CONTRIBUTOR, REMOVE_CONTRIBUTOR, RESET_CONTRIBUTORS,
    UPDATE_CONTRIBUTOR
} from '../actions/contributorActions';

export const contributorReducer = (state: ContributorType[] = [], action: ContributorActions) => {
  switch (action.type) {
    case ADD_CONTRIBUTOR:
      return [...state, action.contributor];
    case REMOVE_CONTRIBUTOR:
      return state.filter(contributor => contributor.id !== action.contributor.id);
    case UPDATE_CONTRIBUTOR:
      return state.map(contributor => {
        if (contributor.id !== action.contributor.id) {
          return contributor;
        }
        return {
          ...contributor,
          ...action.contributor,
        };
      });
    case MOVE_CONTRIBUTOR:
      const position = state.findIndex(i => i.id === action.contributor.id);
      if (
        position < 0 ||
        (action.direction === Direction.ARROW_UP && position === 0) ||
        (action.direction === Direction.ARROW_DOWN && position === state.length - 1)
      ) {
        return state; // canot move outside of array
      }

      const item = state[position]; // save item for later
      const newItems = state.filter(i => i.id !== action.contributor.id); // remove item from array
      newItems.splice(position + action.direction, 0, item);
      return newItems;
    case RESET_CONTRIBUTORS:
      return [];
    default:
      return state;
  }
};

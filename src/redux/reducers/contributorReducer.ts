import ContributorType from '../../types/contributor.types';
import {
  ContributorActions,
  ADD_CONTRIBUTOR,
  REMOVE_CONTRIBUTOR,
  UPDATE_CONTRIBUTOR,
  MOVE_CONTRIBUTOR,
} from '../actions/contributorActions';
import { ARROW_UP, ARROW_DOWN } from '../../utils/constants';
import { RESET_CONTRIBUTORS } from './../actions/contributorActions';

export const contributorReducer = (state: ContributorType[] = [], action: ContributorActions) => {
  switch (action.type) {
    case ADD_CONTRIBUTOR:
      let addArray = state.slice();
      addArray.push(action.contributor);
      return addArray;
    case REMOVE_CONTRIBUTOR:
      let removeArray = state.filter(contributor => {
        return contributor.id !== action.contributor.id;
      });
      return removeArray;
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
      if (position < 0) {
        throw new Error('Given item not found.');
      } else if (
        (action.direction === ARROW_UP && position === 0) ||
        (action.direction === ARROW_DOWN && position === state.length - 1)
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

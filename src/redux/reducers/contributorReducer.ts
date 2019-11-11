import Contributor from '../../types/contributor.types';
import {
  ContributorActions,
  ADD_CONTRIBUTOR,
  REMOVE_CONTRIBUTOR,
  UPDATE_CONTRIBUTOR,
} from '../actions/contributorActions';

export const userReducer = (contributors: Contributor[] = [], action: ContributorActions) => {
  switch (action.type) {
    case ADD_CONTRIBUTOR:
      let addArray = contributors.slice();
      addArray.push(action.contributor);
      return addArray;
    case REMOVE_CONTRIBUTOR:
      let removeArray = contributors.filter(contributor => {
        return contributor.id !== action.contributor.id;
      });
      return removeArray;
    case UPDATE_CONTRIBUTOR:
      return contributors.map(contributor => {
        if (contributor.id !== action.contributor.id) {
          return contributor;
        }
        return {
          ...contributor,
          ...action.contributor,
        };
      });
  }
};

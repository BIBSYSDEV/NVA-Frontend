import { ResourcesActions, SET_RESOURCE } from '../actions/resourcesActions';

export const resourcesReducer = (state = {}, action: ResourcesActions) => {
  switch (action.type) {
    case SET_RESOURCE:
      return { ...state, [action.resource.id]: action.resource };
    default:
      return state;
  }
};

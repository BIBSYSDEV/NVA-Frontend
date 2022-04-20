import { ResourcesActions, ResourceType, SET_RESOURCE } from '../actions/resourcesActions';

interface ResourceState {
  [id: string]: ResourceType;
}

export const resourcesReducer = (state: ResourceState = {}, action: ResourcesActions): ResourceState => {
  switch (action.type) {
    case SET_RESOURCE:
      return { ...state, [action.resource.id]: action.resource };
    default:
      return state;
  }
};

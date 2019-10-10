import { FETCH_RESOURCES, ResourceActions } from '../actions/resourceActions';
import { Resource } from '../types/resource.types';

export const resourceReducer = (state: Resource[] = [], action: ResourceActions) => {
  switch (action.type) {
    case FETCH_RESOURCES:
      return [...action.resources];
    default:
      return state;
  }
};

import { CristinProject } from '../../types/project.types';
import { Journal, Publisher, Registration } from '../../types/registration.types';

export const SET_RESOURCE = 'set resource';

export type ResourceType = Journal | Publisher | Registration | CristinProject;

export const setResource = (resource: ResourceType): SetResourcesAction => ({
  type: SET_RESOURCE,
  resource,
});

interface SetResourcesAction {
  type: typeof SET_RESOURCE;
  resource: ResourceType;
}

export type ResourcesActions = SetResourcesAction;

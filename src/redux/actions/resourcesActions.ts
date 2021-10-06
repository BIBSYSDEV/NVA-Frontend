import { Journal, Publisher, Registration } from '../../types/registration.types';

export const SET_RESOURCE = 'set resource';

export const setResource = (resource: Journal | Publisher | Registration): SetResourcesAction => ({
  type: SET_RESOURCE,
  resource,
});

interface SetResourcesAction {
  type: typeof SET_RESOURCE;
  resource: Journal | Publisher | Registration;
}

export type ResourcesActions = SetResourcesAction;

// ACTION TYPES
import Contributor from './../../types/contributor.types';
export const ADD_CONTRIBUTOR = 'add contributor';
export const REMOVE_CONTRIBUTOR = 'remove contributor';
export const UPDATE_CONTRIBUTOR = 'update contributor';

// ACTION CREATORS
export const addContributor = (contributor: Contributor): AddContributor => ({
  type: ADD_CONTRIBUTOR,
  contributor,
});

export const removeContributor = (contributor: Contributor): RemoveContributor => ({
  type: REMOVE_CONTRIBUTOR,
  contributor,
});

export const updateContributor = (contributor: Contributor): UpdateContributor => ({
  type: UPDATE_CONTRIBUTOR,
  contributor,
});

interface AddContributor {
  type: typeof ADD_CONTRIBUTOR;
  contributor: Contributor;
}

interface RemoveContributor {
  type: typeof REMOVE_CONTRIBUTOR;
  contributor: Contributor;
}

interface UpdateContributor {
  type: typeof UPDATE_CONTRIBUTOR;
  contributor: Contributor;
}

export type ContributorActions = AddContributor | RemoveContributor | UpdateContributor;

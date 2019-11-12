// ACTION TYPES
import ContributorType from './../../types/contributor.types';
export const ADD_CONTRIBUTOR = 'add contributor';
export const REMOVE_CONTRIBUTOR = 'remove contributor';
export const UPDATE_CONTRIBUTOR = 'update contributor';
export const MOVE_CONTRIBUTOR = 'move contributor';
export const RESET_CONTRIBUTORS = 'reset contributors';

// ACTION CREATORS
export const addContributor = (contributor: ContributorType): AddContributor => ({
  type: ADD_CONTRIBUTOR,
  contributor,
});

export const removeContributor = (contributor: ContributorType): RemoveContributor => ({
  type: REMOVE_CONTRIBUTOR,
  contributor,
});

export const updateContributor = (contributor: ContributorType): UpdateContributor => ({
  type: UPDATE_CONTRIBUTOR,
  contributor,
});

export const moveContributor = (contributor: ContributorType, direction: number): MoveContributor => ({
  type: MOVE_CONTRIBUTOR,
  contributor,
  direction,
});

export const resetContributors = (): ResetContributors => ({
  type: RESET_CONTRIBUTORS,
});

interface AddContributor {
  type: typeof ADD_CONTRIBUTOR;
  contributor: ContributorType;
}

interface RemoveContributor {
  type: typeof REMOVE_CONTRIBUTOR;
  contributor: ContributorType;
}

interface UpdateContributor {
  type: typeof UPDATE_CONTRIBUTOR;
  contributor: ContributorType;
}

interface MoveContributor {
  type: typeof MOVE_CONTRIBUTOR;
  contributor: ContributorType;
  direction: number;
}

interface ResetContributors {
  type: typeof RESET_CONTRIBUTORS;
}

export type ContributorActions =
  | AddContributor
  | RemoveContributor
  | UpdateContributor
  | MoveContributor
  | ResetContributors;

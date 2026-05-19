import { TaskNavigationLocationState } from '../../../types/locationState.types';

export const generateTaskNavigationState = (
  locationState: TaskNavigationLocationState,
  offset: number
): TaskNavigationLocationState => {
  return {
    ...locationState,
    ticketOffset: offset,
  };
};

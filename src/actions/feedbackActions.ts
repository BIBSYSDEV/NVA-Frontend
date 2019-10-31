// ACTION TYPES
export const CLEAR_FEEDBACK = 'clear feedback';

// ACTION CREATORS
export const clearFeedbackAction = () => ({
  type: CLEAR_FEEDBACK,
});

export interface ClearFeedbackAction {
  type: typeof CLEAR_FEEDBACK;
}

export type FeedbackActions = ClearFeedbackAction;

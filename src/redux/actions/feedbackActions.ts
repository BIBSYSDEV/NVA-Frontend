// ACTION TYPES
export const CLEAR_FEEDBACK = 'clear feedback';

// ACTION CREATORS
export const clearFeedback = (): ClearFeedbackAction => ({
  type: CLEAR_FEEDBACK,
});

interface ClearFeedbackAction {
  type: typeof CLEAR_FEEDBACK;
}

export type FeedbackActions = ClearFeedbackAction;

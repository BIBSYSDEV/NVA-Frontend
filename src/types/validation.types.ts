export const initialValidatorState: ValidatorState = {
  publicationErrors: [],
  descriptionErrors: [],
  referencesErrors: [],
};

export interface ValidatorState {
  publicationErrors: YupError[];
  descriptionErrors: YupError[];
  referencesErrors: YupError[];
}

export interface YupError {
  errors: string[];
  message: string;
  name: string;
  path: string;
  type: string;
  value: string;
}

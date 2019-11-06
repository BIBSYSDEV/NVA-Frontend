export const initialFormValidator: FormValidator = {
  publicationErrors: [],
  descriptionErrors: [],
  referencesErrors: [],
};

export interface FormValidator {
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

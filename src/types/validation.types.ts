export const initialFormValidator: FormValidator = {
  publicationErrors: [],
  descriptionErrors: [],
  referencesErrors: [],
  contributorsErrors: [],
  filesAndLicenseErrors: [],
};

export interface FormValidator {
  publicationErrors: YupError[];
  descriptionErrors: YupError[];
  referencesErrors: YupError[];
  contributorsErrors: YupError[];
  filesAndLicenseErrors: YupError[];
}

export interface YupError {
  errors: string[];
  message: string;
  name: string;
  path: string;
  type: string;
  value: string;
}

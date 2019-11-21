import { Language } from './settings.types';
import { defaultLanguage } from '../translations/i18n';

export interface FormsData {
  resourceDescription: ResourceDescriptionFormData;
}

export interface ResourceDescriptionFormData {
  title: string;
  abstract: string;
  description: string;
  npi: string;
  language: Language;
  date?: Date;
  year?: number;
  project: string;
}

export const emptyResourceDescription: ResourceDescriptionFormData = {
  title: '',
  abstract: '',
  description: '',
  npi: '',
  language: defaultLanguage,
  date: undefined,
  year: undefined,
  project: '',
};

export const emptyForms: FormsData = {
  resourceDescription: emptyResourceDescription,
};

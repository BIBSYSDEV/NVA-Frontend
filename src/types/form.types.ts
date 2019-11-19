import { Language } from './settings.types';
import { defaultLanguage } from '../translations/i18n';

export interface Forms {
  resourceDescription: ResourceDescriptionFormData;
}

export interface ResourceDescriptionFormData {
  title: string;
  abstract: string;
  description: string;
  npi: string;
  language: Language;
  date: number;
  project: string;
}

export const emptyForms: Forms = {
  resourceDescription: {
    title: '',
    abstract: '',
    description: '',
    npi: '',
    language: defaultLanguage,
    date: Date.now(),
    project: '',
  },
};

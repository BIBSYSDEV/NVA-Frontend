import { defaultLanguage } from '../translations/i18n';
import ContributorType from './contributor.types';
import { ReferenceType } from './references.types';
import { Language } from './settings.types';

export interface FormsData {
  description: DescriptionFormData;
  references: ReferencesFormData;
  contributors: ContributorsFormData;
}

export interface DescriptionFormData {
  title: string;
  abstract: string;
  description: string;
  npi: string;
  language: Language;
  date?: Date;
  year?: number;
  project: string;
}

export interface ReferencesFormData {
  publisher: {
    issn: string;
    level: string;
    publisher: string;
    title: string;
  };
  referenceType: ReferenceType;
}

export interface ContributorsFormData {
  authors: ContributorType[];
  contributors: ContributorType[];
}

export const emptyDescriptionForm: DescriptionFormData = {
  title: '',
  abstract: '',
  description: '',
  npi: '',
  language: defaultLanguage,
  date: undefined,
  year: undefined,
  project: '',
};

export const emptyReferencesForm: ReferencesFormData = {
  publisher: {
    issn: '',
    level: '',
    publisher: '',
    title: '',
  },
  referenceType: ReferenceType.PUBLICATION_IN_JOURNAL,
};

export const emptyContributorsForm: ContributorsFormData = {
  authors: [],
  contributors: [],
};

export const emptyForms: FormsData = {
  description: emptyDescriptionForm,
  references: emptyReferencesForm,
  contributors: emptyContributorsForm,
};

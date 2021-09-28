import { LanguageString } from './common.types';

export interface Category {
  type: 'HrcsConcept';
  id: string;
  identifier: string;
  cristinIdentifier: string;
  label: LanguageString;
  name: string;
  shortName: string;
  subcategories?: Category[];
  related?: string | string[];
}

export interface VocabularyData {
  categories: Category[];
}

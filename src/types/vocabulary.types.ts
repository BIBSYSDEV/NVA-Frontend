import { LanguageString } from './common.types';

export interface Category {
  type: 'HrcsConcept';
  id: string;
  identifier: string;
  label: LanguageString;
  subcategories?: Category[];
}

export interface VocabularyData {
  '@context': any;
  categories: Category[];
}

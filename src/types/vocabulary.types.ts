import { LanguageString } from './publication_types/commonRegistration.types';

interface Category {
  type: 'HrcsConcept';
  id: string;
  identifier: string;
  label: LanguageString;
  subcategories?: Category[];
}

export interface VocabularyResponse {
  '@context': any;
  categories: Category[];
}

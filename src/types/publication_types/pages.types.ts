import { BackendType } from '../registration.types';
import { BackendTypeNames } from './commonRegistration.types';

export interface PagesRange extends BackendType {
  begin: string;
  end: string;
}

export interface PagesMonograph extends BackendType {
  pages: string;
}

export const emptyPagesMonograph: PagesMonograph = {
  type: BackendTypeNames.PAGES_MONOGRAPH,
  pages: '',
};

export const emptyPagesRange: PagesRange = {
  type: BackendTypeNames.PAGES_RANGE,
  begin: '',
  end: '',
};

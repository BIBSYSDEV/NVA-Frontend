import { BackendType, BaseEntityDescription } from '../registration.types';
import { PublicationType, DegreeType } from '../publicationFieldNames';

import { PagesMonograph, emptyPagesMonograph } from './pages.types';

export interface DegreePublicationInstance {
  type: DegreeType | '';
  pages: PagesMonograph | null;
}

export const emptyDegreePublicationInstance: DegreePublicationInstance = {
  type: '',
  pages: emptyPagesMonograph,
};

export interface DegreePublicationContext {
  type: PublicationType | '';
  isbnList: string[];
  openAccess: boolean;
  peerReviewed: boolean;
  publisher: string;
  seriesNumber: string;
  seriesTitle: string;
  url: string;
}

interface DegreeReference extends BackendType {
  doi: string;
  publicationContext: DegreePublicationContext;
  publicationInstance: DegreePublicationInstance;
}

export interface DegreeEntityDescription extends BaseEntityDescription {
  reference: DegreeReference;
}

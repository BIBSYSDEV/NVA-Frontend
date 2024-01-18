import { ChapterType, PublicationType } from '../publicationFieldNames';
import { BaseEntityDescription, BaseReference, BaseRegistration, ContextPublisher } from '../registration.types';
import { PagesRange, emptyPagesRange } from './pages.types';

export interface ChapterRegistration extends BaseRegistration {
  entityDescription: ChapterEntityDescription;
}

export interface ChapterPublicationInstance {
  type: ChapterType | '';
  pages: PagesRange | null;
}

export interface ChapterPublicationContext {
  type: PublicationType.Anthology;
  publisher: ContextPublisher;
  id: string | null;
}

export const emptyChapterPublicationInstance: ChapterPublicationInstance = {
  type: '',
  pages: emptyPagesRange,
};

interface ChapterReference extends BaseReference {
  publicationContext: ChapterPublicationContext;
  publicationInstance: ChapterPublicationInstance;
}

export interface ChapterEntityDescription extends BaseEntityDescription {
  reference: ChapterReference | null;
}

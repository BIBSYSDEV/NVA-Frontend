import { BaseEntityDescription, BaseReference } from '../registration.types';
import { PublicationType, ExhibitionContentType } from '../publicationFieldNames';

interface ExhibitionPublicationInstance {
  type: ExhibitionContentType;
}

export const emptyExhibitionPublicationInstance: ExhibitionPublicationInstance = {
  type: ExhibitionContentType.ExhibitionProduction,
};

export const emptyExhibitionPublicationContext: ExhibitionPublicationContext = {
  type: PublicationType.ExhibitionContent,
};

interface ExhibitionPublicationContext {
  type: PublicationType.ExhibitionContent;
}

interface ExhibitionReference extends BaseReference {
  publicationContext: ExhibitionPublicationContext;
  publicationInstance: ExhibitionPublicationInstance;
}

export interface ExhibitionEntityDescription extends BaseEntityDescription {
  reference: ExhibitionReference | null;
}

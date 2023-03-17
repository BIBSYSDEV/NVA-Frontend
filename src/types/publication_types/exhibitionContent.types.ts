import { BaseEntityDescription, BaseReference, BaseRegistration } from '../registration.types';
import { PublicationType, ExhibitionContentType } from '../publicationFieldNames';

export interface ExhibitionRegistration extends BaseRegistration {
  entityDescription: ExhibitionEntityDescription;
}

interface ExhibitionPublicationInstance {
  type: ExhibitionContentType;
  subtype: {
    type: ExhibitionProductionSubtype | '';
    description?: string;
  };
}

export const emptyExhibitionPublicationInstance: ExhibitionPublicationInstance = {
  type: ExhibitionContentType.ExhibitionProduction,
  subtype: {
    type: '',
    description: '',
  },
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
  reference: ExhibitionReference;
}

export enum ExhibitionProductionSubtype {
  BasicExhibition = 'BasicExhibition',
  TemporaryExhibition = 'TemporaryExhibition',
  PopupExhibition = 'PopupExhibition',
  AmbulatingExhibition = 'AmbulatingExhibition',
  DigitalExhibition = 'DigitalExhibition',
  HistoricalInterior = 'HistoricalInterior',
  Other = 'Other',
}

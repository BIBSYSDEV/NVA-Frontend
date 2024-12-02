import { Period, Place, UnconfirmedOrganization } from '../common.types';
import { ExhibitionContentType, PublicationType } from '../publicationFieldNames';
import { BaseEntityDescription, BaseReference, BaseRegistration } from '../registration.types';

export interface ExhibitionRegistration extends BaseRegistration {
  entityDescription: ExhibitionEntityDescription;
}

export type ExhibitionManifestation = ExhibitionBasic | ExhibitionCatalog;

export interface ExhibitionBasic {
  type: 'ExhibitionBasic';
  organization: UnconfirmedOrganization;
  place: Place;
  date: Period;
}

export interface ExhibitionCatalog {
  type: 'ExhibitionCatalog';
  id: string;
}

export interface ExhibitionPublicationInstance {
  type: ExhibitionContentType;
  subtype: {
    type: ExhibitionProductionSubtype | '';
    description?: string;
  };
  manifestations: ExhibitionManifestation[];
}

export const emptyExhibitionPublicationInstance: ExhibitionPublicationInstance = {
  type: ExhibitionContentType.ExhibitionProduction,
  subtype: {
    type: '',
    description: '',
  },
  manifestations: [],
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
  Other = 'ExhibitionProductionOther',
}

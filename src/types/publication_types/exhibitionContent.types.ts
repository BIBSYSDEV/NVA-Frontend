import { BaseEntityDescription, BaseReference, BaseRegistration } from '../registration.types';
import { PublicationType, ExhibitionContentType } from '../publicationFieldNames';
import { Instant, Period, Place, UnconfirmedOrganization } from '../common.types';
import { UnconfirmedPublisher } from './artisticRegistration.types';

export interface ExhibitionRegistration extends BaseRegistration {
  entityDescription: ExhibitionEntityDescription;
}

export type ExhibitionManifestation = ExhibitionBasic | ExhibitionOtherPresentation;

export interface ExhibitionBasic {
  type: 'ExhibitionBasic';
  title: string;
  organization: UnconfirmedOrganization;
  place: Place;
  date: Period;
}

export interface ExhibitionOtherPresentation {
  type: 'ExhibitionOtherPresentation';
  typeDescription: string;
  description: string;
  place: Place;
  publisher: UnconfirmedPublisher;
  date: Instant;
}

interface ExhibitionPublicationInstance {
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
  Other = 'Other',
}

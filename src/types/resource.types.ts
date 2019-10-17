import { ContentType } from './content.types';
import { string } from 'yup';

export enum Access {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum ResourceType {
  AUDIOVISUAL = 'Audiovisual',
  COLLECTION = 'Collection',
  DATA_PAPER = 'DataPaper',
  DATASET = 'Dataset',
  EVENT = 'Event',
  IMAGE = 'Image',
  INTERACTIVE_RESOURCE = 'InteractiveResource',
  MODEL = 'Model',
  PHYSICAL_OBJECT = 'PhysicalObject',
  SERVICE = 'Service',
  SOFTWARE = 'Software',
  SOUND = 'Sound',
  TEXT = 'Text',
  WORKFLOW = 'Workflow',
  OTHER = 'Other',
}

export interface Resource {
  identifier: string;
  access: Access;
  content: string;
  content_type: ContentType;
  description?: string;
  identifier_handle?: string;
  published: boolean;
  submitter_email?: string;
  time_created: Date;
  time_published?: Date;
  title: string;
  type: ResourceType;
}

export const emptyResource: Resource = {
  identifier: '',
  access: Access.PRIVATE,
  content: '',
  content_type: ContentType.FILE,
  published: false,
  time_created: new Date(),
  title: '',
  type: ResourceType.COLLECTION,
};

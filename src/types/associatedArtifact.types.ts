import { Uppy as UppyType } from '@uppy/core';
import { CustomerRrsType } from './customerInstitution.types';

export type AssociatedFileType = 'PublishedFile' | 'UnpublishedFile' | 'UnpublishableFile';

type FileRrsType =
  | 'NullRightsRetentionStrategy'
  | 'FunderRightsRetentionStrategy'
  | 'CustomerRightsRetentionStrategy'
  | 'OverriddenRightsRetentionStrategy';

export interface FileRrs {
  type: FileRrsType;
  configuredType?: CustomerRrsType;
}

export enum FileVersion {
  Published = 'PublishedVersion',
  Accepted = 'AcceptedVersion',
}

export interface AssociatedFile {
  type: AssociatedFileType;
  identifier: string;
  name: string;
  size: number;
  mimeType?: string;
  administrativeAgreement: boolean;
  publisherVersion: FileVersion | null;
  embargoDate: Date | null;
  license: string | null;
  legalNote?: string;
  rightsRetentionStrategy: FileRrs;
  uploadDetails?: UploadDetails;
}

interface UploadDetails {
  type: 'UploadDetails';
  uploadedBy: string;
  uploadedDate: string;
}

export const emptyFile: AssociatedFile = {
  type: 'UnpublishedFile',
  identifier: '',
  name: '',
  size: 0,
  mimeType: '',
  administrativeAgreement: false,
  publisherVersion: null,
  embargoDate: null,
  license: '',
  rightsRetentionStrategy: {
    type: 'NullRightsRetentionStrategy',
  },
};

export interface AssociatedLink {
  type: 'AssociatedLink';
  id: string;
  name?: string;
  description?: string;
}

export interface NullAssociatedArtifact {
  type: 'NullAssociatedArtifact';
}

export interface Uppy extends UppyType {
  hasUploadSuccessEventListener?: boolean;
}

export type AssociatedArtifact = AssociatedFile | AssociatedLink | NullAssociatedArtifact;

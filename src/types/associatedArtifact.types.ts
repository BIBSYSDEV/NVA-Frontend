import { Uppy as UppyType } from '@uppy/core';
import { CustomerRrsType } from './customerInstitution.types';
import { FileType } from './registration.types';

export type AssociatedFileType = FileType.PublishedFile | FileType.UnpublishedFile | FileType.UnpublishableFile;

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
  type: FileType.UnpublishedFile,
  identifier: '',
  name: '',
  size: 0,
  mimeType: '',
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

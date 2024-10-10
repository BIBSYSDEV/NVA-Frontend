import { Uppy as UppyType } from '@uppy/core';
import { CustomerRrsType } from './customerInstitution.types';

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

export enum FileType {
  UnpublishedFile = 'UnpublishedFile',
  UnpublishableFile = 'UnpublishableFile',
  PublishedFile = 'PublishedFile',
}

export interface AssociatedFile {
  type: FileType;
  identifier: string;
  name: string;
  size: number;
  mimeType?: string;
  publisherVersion: FileVersion | null;
  embargoDate: Date | null;
  license: string | null;
  legalNote?: string;
  rightsRetentionStrategy: FileRrs;
  uploadDetails?: UserUploadDetails | ImportUploadDetails;
  publishedDate?: string;
}

export interface UserUploadDetails {
  type: 'UserUploadDetails';
  uploadedBy: string;
  uploadedDate: string;
}

export interface ImportUploadDetails {
  type: 'ImportUploadDetails';
  source: string;
  archive: string;
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

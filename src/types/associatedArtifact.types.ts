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
  /** @deprecated Use PendingOpenFile instead */
  UnpublishedFile = 'UnpublishedFile',
  /** @deprecated Use RejectedFile|InternalFile|PendingInternalFile instead */
  UnpublishableFile = 'UnpublishableFile',
  /** @deprecated Use OpenFile instead */
  PublishedFile = 'PublishedFile',

  OpenFile = 'OpenFile',
  PendingOpenFile = 'PendingOpenFile',
  RejectedFile = 'RejectedFile',
  InternalFile = 'InternalFile',
  PendingInternalFile = 'PendingInternalFile',
  HiddenFile = 'HiddenFile',
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

interface UserUploadDetails {
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
  type: FileType.PendingOpenFile,
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

export type AssociatedArtifact = AssociatedFile | AssociatedLink | NullAssociatedArtifact;

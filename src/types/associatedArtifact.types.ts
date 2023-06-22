import { Uppy as UppyType } from '@uppy/core';

export type AssociatedFileType = 'PublishedFile' | 'UnpublishedFile' | 'UnpublishableFile';

export interface AssociatedFile {
  type: AssociatedFileType;
  identifier: string;
  name: string;
  size: number;
  mimeType: string;
  administrativeAgreement: boolean;
  publisherAuthority: boolean | null;
  embargoDate: Date | null;
  license: string | null;
}

export const emptyFile: AssociatedFile = {
  type: 'UnpublishedFile',
  identifier: '',
  name: '',
  size: 0,
  mimeType: '',
  administrativeAgreement: false,
  publisherAuthority: null,
  embargoDate: null,
  license: '',
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

import Uppy from '@uppy/core';
import { useEffect } from 'react';
import { UppyDashboard } from '../../../components/UppyDashboard';
import {
  AssociatedFile,
  emptyFile,
  FileRrs,
  FileType,
  UserUploadDetails,
} from '../../../types/associatedArtifact.types';

interface FileUploaderProps {
  addFile: (file: AssociatedFile) => void;
  uppy?: Uppy;
  disabled?: boolean;
}

interface UploadedFile {
  type: 'UploadedFile';
  identifier: string;
  mimeType: string;
  name: string;
  rightsRetentionStrategy: FileRrs;
  size: number;
  uploadDetails: UserUploadDetails;
}

export const FileUploader = ({ addFile, uppy, disabled = !uppy }: FileUploaderProps) => {
  useEffect(() => {
    if (uppy && !uppy.opts.meta.hasUploadSuccessEventListener) {
      uppy.on('upload-success', (file, response) => {
        const uploadedFile = response.body as unknown as UploadedFile;
        const newFile: AssociatedFile = {
          ...emptyFile,
          ...uploadedFile,
          type: FileType.PendingOpenFile,
        };
        addFile(newFile);
      });
      // Avoid duplicating event listener
      uppy.opts.meta.hasUploadSuccessEventListener = true;
    }
  }, [addFile, uppy]);

  return uppy ? <UppyDashboard uppy={uppy} disabled={disabled} /> : null;
};

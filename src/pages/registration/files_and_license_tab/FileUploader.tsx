import Uppy from '@uppy/core';
import { useEffect } from 'react';
import { UppyDashboard } from '../../../components/UppyDashboard';
import { AssociatedFile, emptyFile } from '../../../types/associatedArtifact.types';

interface FileUploaderProps {
  addFile: (file: AssociatedFile) => void;
  uppy?: Uppy;
  disabled?: boolean;
}

type UploadedFile = Pick<
  AssociatedFile,
  'type' | 'identifier' | 'name' | 'size' | 'mimeType' | 'rightsRetentionStrategy' | 'uploadDetails'
>;

export const FileUploader = ({ addFile, uppy, disabled = !uppy }: FileUploaderProps) => {
  useEffect(() => {
    if (uppy && !uppy.opts.meta.hasUploadSuccessEventListener) {
      uppy.on('upload-success', (file, response) => {
        const uploadedFile = response.body as unknown as UploadedFile;
        const newFile: AssociatedFile = {
          ...emptyFile,
          ...uploadedFile,
        };
        addFile(newFile);
      });
      // Avoid duplicating event listener
      uppy.opts.meta.hasUploadSuccessEventListener = true;
    }
  }, [addFile, uppy]);

  return uppy ? <UppyDashboard uppy={uppy} disabled={disabled} /> : null;
};

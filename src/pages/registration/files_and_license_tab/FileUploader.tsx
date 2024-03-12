import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { UppyDashboard } from '../../../components/UppyDashboard';
import { RootState } from '../../../redux/store';
import { AssociatedFile, emptyFile, Uppy } from '../../../types/associatedArtifact.types';

interface FileUploaderProps {
  addFile: (file: AssociatedFile) => void;
  uppy: Uppy;
  disabled?: boolean;
}

export const FileUploader = ({ addFile, uppy, disabled = false }: FileUploaderProps) => {
  const customer = useSelector((state: RootState) => state.customer);

  useEffect(() => {
    if (uppy && !uppy.hasUploadSuccessEventListener && customer) {
      uppy.on('upload-success', (file, response) => {
        const newFile: AssociatedFile = {
          ...emptyFile,
          identifier: response.uploadURL ?? '', // In reality an ID from completeMultipartUpload endpoint
          name: file?.name ?? '',
          mimeType: file?.type ?? '',
          size: file?.size ?? 0,
          rightsRetentionStrategy: { type: 'NullRightsRetentionStrategy' },
        };
        addFile(newFile);
      });
      // Avoid duplicating event listener
      uppy.hasUploadSuccessEventListener = true;
    }
  }, [addFile, uppy, customer]);

  return uppy ? <UppyDashboard uppy={uppy} disabled={disabled} /> : null;
};

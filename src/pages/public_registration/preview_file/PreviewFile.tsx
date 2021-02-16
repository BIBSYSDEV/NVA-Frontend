import React from 'react';
import { File } from '../../../types/file.types';
import { PreviewImg } from './PreviewImg';
import { PreviewPdf } from './PreviewPdf';
import { PreviewUnavailable } from './PreviewUnavailable';

export interface CommonPreviewProps {
  url: string;
}

interface PreviewFileProps extends CommonPreviewProps {
  file: File;
}

export const PreviewFile = ({ url, file, ...props }: PreviewFileProps) => {
  const fileType = file.mimeType.toLowerCase();

  return fileType.includes('pdf') ? (
    <PreviewPdf url={url} {...props} />
  ) : fileType.includes('image') ? (
    <PreviewImg url={url} imgAlt={file.name} {...props} />
  ) : (
    <PreviewUnavailable {...props} />
  );
};

import React from 'react';
import { File } from '../../../types/file.types';
import { PreviewImg } from './PreviewImg';
import { PreviewOfficeFile } from './PreviewOfficeFile';
import { PreviewPdf } from './PreviewPdf';
import { PreviewUnavailable } from './PreviewUnavailable';

export interface CommonPreviewProps {
  url: string;
}

interface PreviewFileProps extends CommonPreviewProps {
  file: File;
}

// FileType values should be a unique (sub)string for MIME types
enum FileType {
  Image = 'image',
  Office = 'officedocument',
  PDF = 'application/pdf',
}

export const PreviewFile = ({ url, file, ...props }: PreviewFileProps) => {
  const fileType = file.mimeType.toLowerCase();

  return fileType.includes(FileType.PDF) ? (
    <PreviewPdf url={url} {...props} />
  ) : fileType.includes(FileType.Image) ? (
    <PreviewImg url={url} imgAlt={file.name} {...props} />
  ) : fileType.includes(FileType.Office) ? (
    <PreviewOfficeFile url={url} iframeTitle={file.name} {...props} />
  ) : (
    <PreviewUnavailable {...props} />
  );
};

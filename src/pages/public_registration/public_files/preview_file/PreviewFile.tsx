import { AssociatedFile } from '../../../../types/associatedArtifact.types';
import { PreviewImg } from './PreviewImg';
import { PreviewOfficeFile } from './PreviewOfficeFile';
import { PreviewPdf } from './PreviewPdf';
import { PreviewUnavailable } from './PreviewUnavailable';

export interface CommonPreviewProps {
  url: string;
  altText?: string;
}

interface PreviewFileProps extends CommonPreviewProps {
  file: AssociatedFile;
}

const isImage = (mimeType: string) => mimeType.startsWith('image/');
const isOfficeFile = (mimeType: string) => mimeType.startsWith('application/vnd.openxmlformats-officedocument.');
const isPdf = (mimeType: string) => mimeType === 'application/pdf';

export const PreviewFile = ({ url, file, ...props }: PreviewFileProps) => {
  const mimeType = file.mimeType?.toLowerCase() ?? '';
  return isPdf(mimeType) ? (
    <PreviewPdf url={url} altText={file.name} {...props} />
  ) : isImage(mimeType) ? (
    <PreviewImg url={url} altText={file.name} {...props} />
  ) : isOfficeFile(mimeType) ? (
    <PreviewOfficeFile url={url} altText={file.name} {...props} />
  ) : (
    <PreviewUnavailable {...props} />
  );
};

import styled from 'styled-components';
import { File } from '../../types/file.types';

const StyledObject = styled.object`
  width: 100%;
  height: 25rem;
`;

const StyledImg = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

interface CommonPreviewProps {
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
    <PreviewImg url={url} {...props} />
  ) : null;
};

export const PreviewPdf = ({ url, ...props }: CommonPreviewProps) => {
  const fallbackPdfPreviewUrl = `https://docs.google.com/viewer?url=${url}&embedded=true`;

  return (
    <StyledObject data={url} type="application/pdf" {...props}>
      <embed type="application/pdf" src={fallbackPdfPreviewUrl} />
    </StyledObject>
  );
};

const PreviewImg = ({ url, ...props }: CommonPreviewProps) => <StyledImg src={url} alt="UPSYDAISY" {...props} />;

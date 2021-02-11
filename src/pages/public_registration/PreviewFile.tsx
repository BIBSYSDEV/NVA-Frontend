import styled from 'styled-components';
import { File } from '../../types/file.types';

const StyledObject = styled.object`
  width: 100%;
  height: 20rem;
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
  const isImg = fileType.includes('image');
  const isPdf = fileType.includes('pdf');

  if (!isPdf && !isImg) {
    return null;
  }

  return <div {...props}>{isPdf ? <PreviewPdf url={url} /> : isImg ? <PreviewImg url={url} /> : null}</div>;
};

export const PreviewPdf = ({ url }: CommonPreviewProps) => {
  const fallbackPreviewUrl = `https://docs.google.com/viewer?url=${url}&embedded=true`;
  return (
    <StyledObject data={url}>
      <embed src={fallbackPreviewUrl} />
    </StyledObject>
  );
};

const PreviewImg = ({ url }: CommonPreviewProps) => {
  return <StyledImg src={url} alt="UPSYDAISY" />;
};

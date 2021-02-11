import styled from 'styled-components';

const StyledContentObject = styled.object`
  width: 100%;
`;

interface PreviewPdfOrImgProps {
  url: string;
}

export const PreviewPdfOrImg = ({ url, ...props }: PreviewPdfOrImgProps) => {
  const fallbackPreviewUrl = `https://docs.google.com/viewer?url=${url}&embedded=true`;
  return (
    <StyledContentObject data={url} {...props}>
      <embed src={fallbackPreviewUrl} />
    </StyledContentObject>
  );
};

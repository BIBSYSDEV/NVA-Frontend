import styled from 'styled-components';
import { CommonPreviewProps } from './PreviewFile';

const StyledIframe = styled.iframe`
  width: 100%;
  height: 25rem;
`;

interface PreviewOfficeFileProps extends CommonPreviewProps {
  iframeTitle: string;
}

export const PreviewOfficeFile = ({ url, iframeTitle, ...props }: PreviewOfficeFileProps) => {
  const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;

  return <StyledIframe title={iframeTitle} src={officeViewerUrl} {...props} />;
};

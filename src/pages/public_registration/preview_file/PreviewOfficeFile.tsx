import { Box } from '@mui/material';
import { CommonPreviewProps } from './PreviewFile';

interface PreviewOfficeFileProps extends CommonPreviewProps {
  iframeTitle: string;
}

export const PreviewOfficeFile = ({ url, iframeTitle, ...props }: PreviewOfficeFileProps) => {
  const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;

  return (
    <Box
      component="iframe"
      title={iframeTitle}
      src={officeViewerUrl}
      sx={{ width: '100%', height: '25rem' }}
      {...props}
    />
  );
};

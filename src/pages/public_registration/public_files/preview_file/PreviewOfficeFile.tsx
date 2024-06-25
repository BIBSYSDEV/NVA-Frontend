import { Box } from '@mui/material';
import { dataTestId } from '../../../../utils/dataTestIds';
import { CommonPreviewProps } from './PreviewFile';

export const PreviewOfficeFile = ({ url, altText, ...props }: CommonPreviewProps) => {
  const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url.shortenedVersion)}`;

  return (
    <Box
      data-testid={dataTestId.registrationLandingPage.filePreview}
      component="iframe"
      title={altText}
      src={officeViewerUrl}
      sx={{ width: '100%', height: '25rem' }}
      {...props}
    />
  );
};

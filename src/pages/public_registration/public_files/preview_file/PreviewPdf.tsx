import { Box } from '@mui/material';
import { useState } from 'react';
import { dataTestId } from '../../../../utils/dataTestIds';
import { CommonPreviewProps } from './PreviewFile';
import { PreviewUnavailable } from './PreviewUnavailable';

const browserDoesNotSupportOnLoad = (): boolean => {
  return isSafariBrowser();
};

const isSafariBrowser = (): boolean => {
  return navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
};

export const PreviewPdf = ({ url, altText, ...props }: CommonPreviewProps) => {
  const [successfullyLoadedPdf, setSuccessfullyLoadedPdf] = useState(browserDoesNotSupportOnLoad());

  return (
    <Box
      data-testid={dataTestId.registrationLandingPage.filePreview}
      component="object"
      type="application/pdf"
      data={url.id}
      {...props}
      title={altText}
      onLoad={() => setSuccessfullyLoadedPdf(true)}
      sx={{ width: '100%', height: successfullyLoadedPdf ? '25rem' : 0 }}>
      <PreviewUnavailable />
    </Box>
  );
};

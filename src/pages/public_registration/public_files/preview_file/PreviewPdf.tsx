import { Box } from '@mui/material';
import { useState } from 'react';
import { dataTestId } from '../../../../utils/dataTestIds';
import { CommonPreviewProps } from './PreviewFile';
import { PreviewUnavailable } from './PreviewUnavailable';

export const PreviewPdf = ({ url, altText, ...props }: CommonPreviewProps) => {
  const [successfullyLoadedPdf, setSuccessfullyLoadedPdf] = useState(false);

  return (
    <Box
      data-testid={dataTestId.registrationLandingPage.filePreview}
      component="object"
      type="application/pdf"
      data={url}
      {...props}
      title={altText}
      aria-label={altText}
      onLoad={() => setSuccessfullyLoadedPdf(true)}
      sx={{ width: '100%', height: successfullyLoadedPdf ? '25rem' : 0 }}>
      <PreviewUnavailable />
    </Box>
  );
};

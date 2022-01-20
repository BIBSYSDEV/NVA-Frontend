import { Box } from '@mui/material';
import { useState } from 'react';
import { CommonPreviewProps } from './PreviewFile';
import { PreviewUnavailable } from './PreviewUnavailable';

export const PreviewPdf = ({ url, ...props }: CommonPreviewProps) => {
  const [successfullyLoadedPdf, setSuccessfullyLoadedPdf] = useState(false);

  return (
    <Box
      component="object"
      type="application/pdf"
      data={url}
      {...props}
      onLoad={() => setSuccessfullyLoadedPdf(true)}
      sx={{ width: '100%', height: successfullyLoadedPdf ? '25rem' : 0 }}>
      <PreviewUnavailable />
    </Box>
  );
};

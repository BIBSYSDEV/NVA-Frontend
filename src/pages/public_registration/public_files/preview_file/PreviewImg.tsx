import { Box } from '@mui/material';
import { dataTestId } from '../../../../utils/dataTestIds';
import { CommonPreviewProps } from './PreviewFile';

export const PreviewImg = ({ url, altText, ...props }: CommonPreviewProps) => (
  <Box
    data-testid={dataTestId.registrationLandingPage.filePreview}
    component="img"
    sx={{ maxWidth: '100%', maxHeight: '25rem' }}
    src={url.id}
    alt={altText}
    {...props}
  />
);

import { Box } from '@mui/material';
import { dataTestId } from '../../../utils/dataTestIds';
import { CommonPreviewProps } from './PreviewFile';

interface PreviewImgProps extends CommonPreviewProps {
  imgAlt: string;
}

export const PreviewImg = ({ url, imgAlt, ...props }: PreviewImgProps) => (
  <Box
    data-testid={dataTestId.registrationLandingPage.filePreview}
    component="img"
    sx={{ maxWidth: '100%', maxHeight: '25rem' }}
    src={url}
    alt={imgAlt}
    {...props}
  />
);

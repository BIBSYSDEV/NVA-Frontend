import { Box } from '@mui/material';
import { CommonPreviewProps } from './PreviewFile';

interface PreviewImgProps extends CommonPreviewProps {
  imgAlt: string;
}

export const PreviewImg = ({ url, imgAlt, ...props }: PreviewImgProps) => (
  <Box component="img" sx={{ maxWidth: '100%', maxHeight: '25rem' }} src={url} alt={imgAlt} {...props} />
);

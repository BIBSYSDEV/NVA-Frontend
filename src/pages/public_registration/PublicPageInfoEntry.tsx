import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface PublicPageInfoEntryProps {
  title: string;
  content: ReactNode;
  'data-testid'?: string;
}

export const PublicPageInfoEntry = ({ title, content, ...rest }: PublicPageInfoEntryProps) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.25rem' }}>
    <Typography sx={{ textWrap: 'nowrap', fontWeight: 700 }}>{title}:</Typography>
    {typeof content === 'string' ? <Typography {...rest}>{content}</Typography> : <div {...rest}>{content}</div>}
  </Box>
);

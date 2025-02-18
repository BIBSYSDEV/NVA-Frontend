import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface PublicPageInfoEntryProps {
  title: string;
  content: ReactNode;
  'data-testid'?: string;
}

export const PublicPageInfoEntry = ({ title, content, ...rest }: PublicPageInfoEntryProps) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.25rem' }}>
    <Typography component="dt" sx={{ textWrap: 'nowrap', fontWeight: 700 }}>
      {title}:
    </Typography>
    {typeof content === 'string' ? (
      <Typography component="dd" {...rest}>
        {content}
      </Typography>
    ) : (
      <dd {...rest}>{content}</dd>
    )}
  </Box>
);

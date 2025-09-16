import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface PublicPageInfoEntryProps {
  title: string;
  content: ReactNode;
  'data-testid'?: string;
}

export const PublicPageInfoEntry = ({ title, content, ...rest }: PublicPageInfoEntryProps) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: '0.5rem' }}>
    <Typography component="dt" sx={{ textWrap: 'nowrap', fontWeight: 700 }}>
      {title}:
    </Typography>
    {typeof content === 'string' ? (
      <Typography component="dd" gridColumn={2} {...rest}>
        {content}
      </Typography>
    ) : (
      content
    )}
  </Box>
);

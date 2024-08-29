import { Box, BoxProps } from '@mui/material';
import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

interface PageHeaderProps extends BoxProps {
  children: ReactNode;
  htmlTitle?: string;
}

export const PageHeader = ({ children, htmlTitle, sx }: PageHeaderProps) => (
  <Box sx={{ width: '100%', marginBottom: '2rem', ...sx }}>
    {htmlTitle && (
      <Helmet>
        <title>{htmlTitle}</title>
      </Helmet>
    )}
    <Box sx={{ pb: '1rem', borderBottom: '2px solid' }}>{children}</Box>
  </Box>
);

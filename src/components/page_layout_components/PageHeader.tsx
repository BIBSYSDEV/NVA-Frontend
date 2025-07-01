import { Box, BoxProps } from '@mui/material';
import { Head } from '@unhead/react';
import { ReactNode } from 'react';

interface PageHeaderProps extends BoxProps {
  children: ReactNode;
  htmlTitle?: string;
}

export const PageHeader = ({ children, htmlTitle, sx }: PageHeaderProps) => (
  <Box sx={{ width: '100%', marginBottom: '2rem', ...sx }}>
    {htmlTitle && (
      <Head>
        <title>{htmlTitle}</title>
      </Head>
    )}
    <Box sx={{ pb: '1rem', borderBottom: '2px solid' }}>{children}</Box>
  </Box>
);

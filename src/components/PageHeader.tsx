import { Box, TypographyProps } from '@mui/material';
import { HeadTitle } from './HeadTitle';
import { TruncatableTypography } from './TruncatableTypography';

interface PageHeaderProps extends TypographyProps {
  children: string;
  htmlTitle?: string;
}

export const PageHeader = ({ children, htmlTitle, ...props }: PageHeaderProps) => (
  <Box sx={{ width: '100%', marginBottom: '2rem' }}>
    <HeadTitle>{htmlTitle ?? children}</HeadTitle>

    <Box
      sx={{
        paddingBottom: '1rem',
        borderBottom: '2px solid',
      }}>
      <TruncatableTypography variant="h1" {...props}>
        {children}
      </TruncatableTypography>
    </Box>
  </Box>
);

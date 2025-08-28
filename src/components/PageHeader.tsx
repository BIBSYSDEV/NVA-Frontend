import { Box, TypographyProps } from '@mui/material';
import { HeadTitle } from './HeadTitle';
import { TruncatableTypography } from './TruncatableTypography';

interface PageHeaderProps extends TypographyProps {
  children: string;
  htmlTitle?: string;
  omitPageTitle?: boolean;
}

export const PageHeader = ({ children, htmlTitle, omitPageTitle = false, ...props }: PageHeaderProps) => (
  <Box sx={{ width: '100%', marginBottom: '2rem' }}>
    {!omitPageTitle && <HeadTitle>{htmlTitle ?? children}</HeadTitle>}

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

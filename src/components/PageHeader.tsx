import { Box, TypographyProps } from '@mui/material';
import { DocumentHeadTitle } from '../context/DocumentHeadTitle';
import { TruncatableTypography } from './TruncatableTypography';

interface PageHeaderProps extends TypographyProps {
  children: string;
  htmlTitle?: string;
}

export const PageHeader = ({ children, htmlTitle, ...props }: PageHeaderProps) => (
  <Box sx={{ width: '100%', marginBottom: '2rem' }}>
    <DocumentHeadTitle>{htmlTitle ?? children}</DocumentHeadTitle>

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

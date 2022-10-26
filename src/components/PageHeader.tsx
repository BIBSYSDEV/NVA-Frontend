import { ReactNode, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Typography, TypographyProps } from '@mui/material';
import { stringIncludesMathJax, typesetMathJax } from '../utils/mathJaxHelpers';
import { TruncatableTypography } from './TruncatableTypography';

interface PageHeaderProps extends TypographyProps {
  children: string;
  htmlTitle?: string;
  superHeader?: string | ReactNode;
}

export const PageHeader = ({ children, superHeader, htmlTitle, ...props }: PageHeaderProps) => (
  <Box sx={{ width: '100%', marginBottom: '2rem', wordBreak: 'break-word' }}>
    <Helmet>
      <title>{htmlTitle ?? children}</title>
    </Helmet>

    {superHeader && (
      <Typography variant="overline" color="primary.dark">
        {superHeader}
      </Typography>
    )}

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

export const ItalicPageHeader = (props: PageHeaderProps) => {
  useEffect(() => {
    if (stringIncludesMathJax(props.children)) {
      typesetMathJax();
    }
  }, [props.children]);

  return (
    <PageHeader variant="h2" variantMapping={{ h2: 'h1' }} sx={{ fontWeight: '700', fontStyle: 'italic' }} {...props} />
  );
};

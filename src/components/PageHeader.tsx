import { ReactNode, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Box, Button, Typography, TypographyProps } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { UrlPathTemplate } from '../utils/urlPaths';
import { stringIncludesMathJax, typesetMathJax } from '../utils/mathJaxHelpers';
import { TruncatableTypography } from './TruncatableTypography';

interface PageHeaderProps extends TypographyProps {
  backPath?: string;
  children: string;
  htmlTitle?: string;
  showBackButton?: boolean;
  superHeader?: {
    title: string | ReactNode;
    icon?: ReactNode;
  };
}

export const PageHeader = ({
  backPath,
  children,
  superHeader,
  htmlTitle,
  showBackButton,
  ...props
}: PageHeaderProps) => {
  const { t } = useTranslation('common');
  const history = useHistory();

  const onBackClick = () => {
    if (backPath) {
      history.push(backPath);
    } else if (history.length === 1) {
      history.push(UrlPathTemplate.Home);
    } else {
      history.goBack();
    }
  };

  return (
    <Box sx={{ width: '100%', marginBottom: '2rem', wordBreak: 'break-word' }}>
      <Helmet>
        <title>{htmlTitle ?? children}</title>
      </Helmet>
      {showBackButton && (
        <Button data-testid="navigate-back-button" startIcon={<ArrowBackIcon />} variant="text" onClick={onBackClick}>
          {t('back')}
        </Button>
      )}
      {superHeader && (
        <Box sx={{ color: 'primary.dark' }}>
          {superHeader.icon}
          <Typography variant="overline" paragraph color="inherit">
            {superHeader.title}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          paddingBottom: '1rem',
          borderBottom: '2px solid',
        }}>
        <TruncatableTypography variant="h1" {...props} lines={3}>
          {children}
        </TruncatableTypography>
      </Box>
    </Box>
  );
};

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

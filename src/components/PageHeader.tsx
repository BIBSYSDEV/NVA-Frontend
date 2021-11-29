import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import TextTruncate from 'react-text-truncate';
import styled from 'styled-components';
import { Box, Button, IconButton, Tooltip, Typography, TypographyProps } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { UrlPathTemplate } from '../utils/urlPaths';
import { ReactNode } from 'react';

const StyledHeader = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  word-break: break-word;
`;

const StyledTruncatableHeading = styled.div<{ canBeTruncated: boolean }>`
  padding-bottom: 1rem;
  border-bottom: 2px solid;
  align-items: center;
  display: grid;
  grid-template-columns: ${({ canBeTruncated }) => (canBeTruncated ? '1fr auto' : '1fr')};
  grid-column-gap: 1rem;

  span {
    display: block;
    width: 100%;
  }
`;

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
  const [showFullText, setShowFullText] = useState(false);
  const [canBeTruncated, setCanBeTruncated] = useState(false);

  const toggleFullText = () => setShowFullText(!showFullText);

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
    <StyledHeader>
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
      <StyledTruncatableHeading canBeTruncated={canBeTruncated}>
        <Typography variant="h1" {...props}>
          <TextTruncate
            line={showFullText ? false : 2}
            truncateText="..."
            text={children}
            element="span"
            onTruncated={() => setCanBeTruncated(true)}
          />
        </Typography>
        {canBeTruncated && (
          <Tooltip title={showFullText ? t<string>('title_minimize') : t<string>('title_expand')}>
            <IconButton color="primary" onClick={toggleFullText}>
              {showFullText ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Tooltip>
        )}
      </StyledTruncatableHeading>
    </StyledHeader>
  );
};

const StyledItalicPageHeader = styled(PageHeader)`
  font-weight: 700;
  font-style: italic;
`;

export const ItalicPageHeader = (props: PageHeaderProps) => (
  <StyledItalicPageHeader variant="h2" variantMapping={{ h2: 'h1' }} {...props} />
);

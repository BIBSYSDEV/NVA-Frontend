import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import TextTruncate from 'react-text-truncate';
import styled from 'styled-components';
import { Button, Typography, TypographyProps } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { UrlPathTemplate } from '../utils/urlPaths';

const StyledHeader = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  word-wrap: break-word;
`;

const StyledTypography = styled(Typography)`
  border-bottom: 3px solid;
  padding-bottom: 0.5rem;
  cursor: pointer;
`;

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.palette.section.light};
  color: ${({ theme }) => theme.palette.section.megaDark};
  padding: 0.2rem;
  min-width: 0;
`;

export interface PageHeaderProps extends TypographyProps {
  backPath?: string;
  children: string;
}

export const PageHeader = ({ backPath, children, ...props }: PageHeaderProps) => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const [showFullText, setShowFullText] = useState(false);

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
      <Button data-testid="navigate-back-button" startIcon={<ArrowBackIcon />} variant="text" onClick={onBackClick}>
        {t('back')}
      </Button>
      <StyledTypography variant="h1" onClick={toggleFullText} {...props}>
        {showFullText ? (
          children
        ) : (
          <TextTruncate
            line={2}
            truncateText="..."
            text={children}
            textTruncateChild={
              <StyledButton variant="contained" onClick={toggleFullText}>
                {showFullText ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </StyledButton>
            }
          />
        )}
      </StyledTypography>
    </StyledHeader>
  );
};

const StyledRegistrationPageHeader = styled(PageHeader)`
  font-weight: 700;
  font-style: italic;
`;

export const RegistrationPageHeader = (props: PageHeaderProps) => {
  return <StyledRegistrationPageHeader variant="h2" variantMapping={{ h2: 'h1' }} {...props} />;
};

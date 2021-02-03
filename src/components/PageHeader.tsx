import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Truncate from 'react-truncate';
import styled from 'styled-components';
import { Button, Typography, TypographyProps } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { UrlPathTemplate } from '../utils/urlPaths';

const StyledHeader = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  word-wrap: break-word;
`;

const StyledTypography = styled(Typography)`
  border-bottom: 3px solid;
  padding-bottom: 0.5rem;
`;

export interface PageHeaderProps extends TypographyProps {
  backPath?: string;
  children: ReactNode;
}

export const PageHeader = ({ backPath, children, ...props }: PageHeaderProps) => {
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
    <StyledHeader>
      <Button data-testid="navigate-back-button" startIcon={<ArrowBackIcon />} variant="text" onClick={onBackClick}>
        {t('back')}
      </Button>
      <StyledTypography variant="h1" {...props}>
        {children}
      </StyledTypography>
    </StyledHeader>
  );
};

const StyledRegistrationPageHeader = styled(PageHeader)`
  font-weight: 700;
  font-style: italic;
`;

export const RegistrationPageHeader = (props: PageHeaderProps) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleFullText = () => setShowFullText(!showFullText);

  return (
    <StyledRegistrationPageHeader variant="h2" variantMapping={{ h2: 'h1' }} onClick={toggleFullText} {...props}>
      {showFullText ? (
        props.children
      ) : (
        <Truncate lines={2} ellipsis="...">
          {props.children}
        </Truncate>
      )}
    </StyledRegistrationPageHeader>
  );
};

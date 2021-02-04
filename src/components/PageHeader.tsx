import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Collapse, Typography, TypographyProps } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { UrlPathTemplate } from '../utils/urlPaths';
import { StyledRightAlignedWrapper } from './styled/Wrappers';

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
  display: grid;
  grid-template-areas: 'title ellipsis button';
  font-weight: 700;
  font-style: italic;
  cursor: pointer;
`;

const RightAlignedWrapper = styled(StyledRightAlignedWrapper)`
  align-items: flex-end;
  margin: 0 1rem;
`;

const StyledEllipsis = styled(Typography)`
  font-weight: 700;
  font-style: italic;
  cursor: pointer;
  align-self: end;
`;

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.palette.section.light};
  color: ${({ theme }) => theme.palette.section.megaDark};
  padding: 0.2rem;
  min-width: 0;
`;

export const RegistrationPageHeader = (props: PageHeaderProps) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleFullText = () => setShowFullText(!showFullText);

  return (
    <StyledRegistrationPageHeader variant="h2" variantMapping={{ h2: 'h1' }} onClick={toggleFullText} {...props}>
      <Collapse in={showFullText} collapsedHeight="5.3rem">
        {props.children}
      </Collapse>
      {!showFullText && (
        <StyledEllipsis variant="h2" variantMapping={{ h2: 'span' }}>
          ...
        </StyledEllipsis>
      )}
      <RightAlignedWrapper>
        <StyledButton variant="contained">
          {showFullText ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </StyledButton>
      </RightAlignedWrapper>
    </StyledRegistrationPageHeader>
  );
};

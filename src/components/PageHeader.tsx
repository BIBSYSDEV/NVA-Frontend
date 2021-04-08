import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import TextTruncate from 'react-text-truncate';
import styled from 'styled-components';
import { Button, Tooltip, Typography, TypographyProps } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { UrlPathTemplate } from '../utils/urlPaths';

const StyledHeader = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  word-wrap: break-word;
`;

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.palette.section.light};
  color: ${({ theme }) => theme.palette.section.megaDark};
`;

const StyledTruncatableHeading = styled.div`
  padding-bottom: 0.3rem;
  border-bottom: 3px solid;
  display: flex;
  align-items: center;
`;

export interface PageHeaderProps extends TypographyProps {
  backPath?: string;
  children: string;
}

export const PageHeader = ({ backPath, children, ...props }: PageHeaderProps) => {
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
      <Button data-testid="navigate-back-button" startIcon={<ArrowBackIcon />} variant="text" onClick={onBackClick}>
        {t('back')}
      </Button>
      <StyledTruncatableHeading>
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
          <Tooltip title={showFullText ? 'Minimer tittel' : 'Vis hele tittel'}>
            <StyledButton variant="contained" onClick={toggleFullText}>
              {showFullText ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </StyledButton>
          </Tooltip>
        )}
      </StyledTruncatableHeading>
    </StyledHeader>
  );
};

const StyledRegistrationPageHeader = styled(PageHeader)`
  font-weight: 700;
  font-style: italic;
`;

export const RegistrationPageHeader = (props: PageHeaderProps) => (
  <StyledRegistrationPageHeader variant="h2" variantMapping={{ h2: 'h1' }} {...props} />
);

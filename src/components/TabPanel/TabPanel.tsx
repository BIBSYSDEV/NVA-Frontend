import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button, Typography } from '@material-ui/core';

interface TabPanelProps {
  ariaLabel: string;
  children?: React.ReactNode;
  isHidden: boolean;
  goToNextTab?: (event: React.MouseEvent<any>) => void;
  onClickSave?: (event: React.MouseEvent<any>) => void;
  heading: string;
}

const StyledHeading = styled.div`
  font-size: 2rem;
  font-weight: bold;
  line-height: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
  margin-right: 0.5rem;
`;

const TabPanel: React.FC<TabPanelProps> = ({ ariaLabel, children, isHidden, goToNextTab, onClickSave, heading }) => {
  const { t } = useTranslation();

  return (
    <Typography component="div" role="tabpanel" hidden={isHidden} aria-labelledby={`nav-tab-${ariaLabel}`}>
      <StyledHeading>{heading}</StyledHeading>
      {children}
      {goToNextTab && (
        <StyledButton color="primary" variant="contained" onClick={goToNextTab}>
          {t('common:next')}
        </StyledButton>
      )}
      {onClickSave && (
        <StyledButton variant="contained" onClick={onClickSave}>
          {t('common:save')}
        </StyledButton>
      )}
    </Typography>
  );
};

export default TabPanel;

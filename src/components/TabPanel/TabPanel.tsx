import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button } from '@material-ui/core';

interface TabPanelProps {
  ariaLabel: string;
  children?: React.ReactNode;
  goToNextTab?: (event: React.MouseEvent<any>) => void;
  onClickSave?: (event: React.MouseEvent<any>) => void;
}

const StyledDiv = styled.div`
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
  margin-right: 0.5rem;
`;

const TabPanel: React.FC<TabPanelProps> = ({ children, goToNextTab, onClickSave }) => {
  const { t } = useTranslation();

  return (
    <StyledDiv>
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
    </StyledDiv>
  );
};

export default TabPanel;

import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button } from '@material-ui/core';
import Progress from '../Progress';

const StyledDiv = styled.div`
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
  margin-right: 0.5rem;
`;

const StyledProgressContainer = styled.div`
  padding-left: 1rem;
  display: flex;
  align-items: center;
`;

export interface TabPanelCommonProps {
  goToNextTab?: (event: React.MouseEvent<any>) => void;
  isSaving?: boolean;
}

interface TabPanelProps extends TabPanelCommonProps {
  ariaLabel: string;
  children?: React.ReactNode;
  onClickSave?: (event: React.MouseEvent<any>) => void;
}

const TabPanel: FC<TabPanelProps> = ({ children, goToNextTab, isSaving, onClickSave }) => {
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
          {isSaving && (
            <StyledProgressContainer>
              <Progress size={15} thickness={5} />
            </StyledProgressContainer>
          )}
        </StyledButton>
      )}
    </StyledDiv>
  );
};

export default TabPanel;

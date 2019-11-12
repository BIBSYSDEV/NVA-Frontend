import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button, Typography } from '@material-ui/core';

import { YupError } from '../../types/validation.types';
import LabelTextLine from '../LabelTextLine';

interface TabPanelProps {
  ariaLabel: string;
  children?: React.ReactNode;
  isHidden: boolean;
  errors?: YupError[];
  onClick: (event: React.MouseEvent<any>) => void;
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

const TabPanel: React.FC<TabPanelProps> = ({ ariaLabel, children, errors, isHidden, onClick, heading }) => {
  const { t } = useTranslation();

  return (
    <Typography component="div" role="tabpanel" hidden={isHidden} aria-labelledby={`nav-tab-${ariaLabel}`}>
      {errors &&
        errors.length > 0 &&
        errors.map((error: any) => {
          return <LabelTextLine key={error.path} label={error.path} text={`${error.name} - ${error.message}`} />;
        })}
      <StyledHeading>{t(heading)}</StyledHeading>
      {children}
      {onClick && (
        <StyledButton color="primary" variant="contained" onClick={onClick}>
          {t('Next')}
        </StyledButton>
      )}
    </Typography>
  );
};

export default TabPanel;

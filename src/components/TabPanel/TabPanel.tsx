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
  goToNextPage?: (event: React.MouseEvent<any>) => void;
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

const TabPanel: React.FC<TabPanelProps> = ({ ariaLabel, children, errors, isHidden, goToNextPage, heading }) => {
  const { t } = useTranslation();

  return (
    <Typography component="div" role="tabpanel" hidden={isHidden} aria-labelledby={`nav-tab-${ariaLabel}`}>
      {errors &&
        errors.length > 0 &&
        errors.map((error: any) => (
          <LabelTextLine key={error.path} label={error.path} text={`${error.name} - ${error.message}`} />
        ))}
      <StyledHeading>{t(heading)}</StyledHeading>
      {children}
      {goToNextPage && (
        <StyledButton color="primary" variant="contained" onClick={goToNextPage}>
          {t('Next')}
        </StyledButton>
      )}
    </Typography>
  );
};

export default TabPanel;

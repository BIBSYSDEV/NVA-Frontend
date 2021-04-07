import React from 'react';
import styled from 'styled-components';
import { Tab, TabProps } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import { useTranslation } from 'react-i18next';

const StyledErrorIcon = styled(ErrorIcon)`
  margin-left: 0.3rem;
  color: ${({ theme }) => theme.palette.error.main};
`;

interface LinkTabProps extends TabProps {
  error?: boolean;
}

export const LinkTab = ({ error, ...rest }: LinkTabProps) => {
  const { t } = useTranslation('registration');

  return (
    <Tab
      {...rest}
      tabIndex="0" // Allow navigating to tab with both arrows and Tab
      icon={error ? <StyledErrorIcon data-testid="error-tab" titleAccess={t('validation_errors')} /> : undefined}
    />
  );
};

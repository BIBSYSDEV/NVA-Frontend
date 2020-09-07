import React, { FC } from 'react';
import styled from 'styled-components';
import { Tab, TabProps } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';

const StyledTab = styled(Tab)`
  margin: auto;
`;

const StyledErrorIcon = styled(ErrorIcon)`
  margin-left: 0.3rem;
  color: ${({ theme }) => theme.palette.danger.main};
`;

interface LinkTabProps extends TabProps {
  error?: boolean;
}

const LinkTab: FC<LinkTabProps> = ({ error, ...rest }) => (
  <StyledTab disableRipple icon={error ? <StyledErrorIcon data-testid="error-tab" /> : undefined} {...rest} />
);

export default LinkTab;

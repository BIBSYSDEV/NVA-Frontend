import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { MuiThemeProvider } from '@material-ui/core';
import darkTheme from '../themes/darkTheme';
import lightTheme from '../themes/lightTheme';
import { isBackgroundColorDark } from '../utils/theme-helpers';
import { StyledPageWrapper } from './styled/Wrappers';

interface BakcgroundDivProps {
  backgroundColor?: string;
  children?: ReactNode;
}

const StyledBackgroundDiv = styled(({ backgroundColor, ...rest }) => <StyledPageWrapper {...rest} />)`
  ${({ backgroundColor }) => `background-color: ${backgroundColor}`}
`;

const BackgroundDiv = ({ children, ...props }: BakcgroundDivProps) => {
  const darkMode = props.backgroundColor && isBackgroundColorDark(props.backgroundColor);

  return (
    <StyledBackgroundDiv {...props}>
      {darkMode ? (
        <MuiThemeProvider theme={darkTheme}>{children}</MuiThemeProvider>
      ) : (
        <MuiThemeProvider theme={lightTheme}>{children}</MuiThemeProvider>
      )}
    </StyledBackgroundDiv>
  );
};

export default BackgroundDiv;

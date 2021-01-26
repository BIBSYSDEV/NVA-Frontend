import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { MuiThemeProvider } from '@material-ui/core';
import darkTheme from '../themes/darkTheme';
import lightTheme from '../themes/lightTheme';
import { isBackgroundColorDark } from '../utils/theme-helpers';

interface BakcgroundDivProps {
  backgroundColor: string;
  children?: ReactNode;
}

const StyledBackgroundDiv = styled(({ backgroundColor, ...rest }) => <div {...rest} />)`
  width: 100%;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 1rem 2rem;
  }
  padding: 0.5rem;
  ${({ backgroundColor }) => `background-color: ${backgroundColor}`}
`;

const BackgroundDiv = ({ children, ...props }: BakcgroundDivProps) => {
  const darkMode = isBackgroundColorDark(props.backgroundColor);

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

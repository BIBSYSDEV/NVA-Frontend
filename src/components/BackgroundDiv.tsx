import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import { darkTheme } from '../themes/darkTheme';
import { lightTheme } from '../themes/lightTheme';
import { isBackgroundColorDark } from '../utils/theme-helpers';
import { StyledPageWrapper } from './styled/Wrappers';

interface BakcgroundDivProps {
  backgroundColor?: string;
  children?: ReactNode;
}

const StyledBackgroundDiv = styled(({ backgroundColor, ...rest }) => <StyledPageWrapper {...rest} />)`
  ${({ backgroundColor }) => `background-color: ${backgroundColor}`}
`;

export const BackgroundDiv = ({ children, ...props }: BakcgroundDivProps) => {
  const darkMode = props.backgroundColor && isBackgroundColorDark(props.backgroundColor);

  return (
    <StyledBackgroundDiv {...props}>
      {darkMode ? (
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
        </StyledEngineProvider>
      ) : (
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
        </StyledEngineProvider>
      )}
    </StyledBackgroundDiv>
  );
};

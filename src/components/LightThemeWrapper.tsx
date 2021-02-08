import { MuiThemeProvider } from '@material-ui/core';
import React, { ReactNode } from 'react';
import lightTheme from '../themes/lightTheme';

interface ContrastInputProps {
  children: ReactNode;
}

export const LightThemeWrapper = ({ children }: ContrastInputProps) => (
  <MuiThemeProvider theme={lightTheme}>{children}</MuiThemeProvider>
);

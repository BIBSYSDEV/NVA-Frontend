import React, { ReactNode } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import theme from '../themes/mainTheme';

interface ContrastContentProps {
  backgroundColor: string;
  children: ReactNode;
}

const ContrastContent = ({ backgroundColor, children }: ContrastContentProps) => {
  const contrastTextColor = theme.palette.getContrastText(backgroundColor);

  const contrastTheme = createMuiTheme({
    ...theme,
    palette: {
      ...theme.palette,
      type: 'dark',
      primary: { main: contrastTextColor },
    },
  });

  return <MuiThemeProvider theme={contrastTheme}>{children}</MuiThemeProvider>;
};

export default ContrastContent;

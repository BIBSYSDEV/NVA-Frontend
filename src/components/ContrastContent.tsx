import React from 'react';
import { createMuiTheme, MuiThemeProvider, TypographyProps } from '@material-ui/core';
import theme from '../themes/mainTheme';

// TODO: Remove this component when using MUI v5, as Typography will support custom colors
// https://github.com/mui-org/material-ui/issues/13875

interface ContrastContentProps extends TypographyProps {
  backgroundColor: string;
}

const ContrastContent = ({ backgroundColor, children, ...rest }: ContrastContentProps) => {
  const contrastTextColor = theme.palette.getContrastText(backgroundColor);

  const contrastTheme = createMuiTheme({
    ...theme,
    palette: {
      ...theme.palette,
      primary: { main: contrastTextColor },
    },
  });

  return <MuiThemeProvider theme={contrastTheme}>{children}</MuiThemeProvider>;
};

export default ContrastContent;

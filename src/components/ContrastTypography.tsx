import React from 'react';
import { createMuiTheme, MuiThemeProvider, Typography, TypographyProps } from '@material-ui/core';
import theme from '../themes/mainTheme';

// TODO: Remove this component when using MUI v5, as Typography will support custom colors
// https://github.com/mui-org/material-ui/issues/13875

interface ContrastTypographyProps extends TypographyProps {
  backgroundColor: string;
}

const ContrastTypography = ({ backgroundColor, ...rest }: ContrastTypographyProps) => {
  const contrastTextColor = theme.palette.getContrastText(backgroundColor);

  const contrastTheme = createMuiTheme({
    ...theme,
    palette: {
      ...theme.palette,
      primary: { main: contrastTextColor },
    },
  });

  return (
    <MuiThemeProvider theme={contrastTheme}>
      <Typography {...rest} color="primary" />
    </MuiThemeProvider>
  );
};

export default ContrastTypography;

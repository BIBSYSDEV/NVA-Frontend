import React from 'react';
import { Button, ButtonProps, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import theme from '../themes/mainTheme';

// TODO: Remove this component when using MUI v5, as it will support <Button color="error" />
// https://github.com/mui-org/material-ui/issues/13875#issuecomment-757354671

const dangerTheme = createMuiTheme({
  ...theme,
  palette: {
    ...theme.palette,
    primary: { main: theme.palette.error.main },
  },
});

const DangerButton = (props: ButtonProps) => (
  <MuiThemeProvider theme={dangerTheme}>
    <Button {...props} color="primary" />
  </MuiThemeProvider>
);

export default DangerButton;

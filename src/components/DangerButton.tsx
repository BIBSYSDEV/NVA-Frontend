import React from 'react';
import { Button, ButtonProps, createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material';
import { lightTheme } from '../themes/lightTheme';

// TODO: Remove this component when using MUI v5, as it will support <Button color="error" />
// https://github.com/mui-org/material-ui/issues/13875#issuecomment-757354671

const dangerTheme = createTheme(
  adaptV4Theme({
    ...lightTheme,
    palette: {
      ...lightTheme.palette,
      primary: { main: lightTheme.palette.error.main },
    },
  })
);

export const DangerButton = (props: ButtonProps) => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={dangerTheme}>
      <Button {...props} color="primary" />
    </ThemeProvider>
  </StyledEngineProvider>
);

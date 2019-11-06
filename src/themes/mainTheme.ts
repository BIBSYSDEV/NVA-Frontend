import { createMuiTheme } from '@material-ui/core';

export default createMuiTheme({
  palette: {
    primary: {
      main: '#6558f5',
    },
    text: {
      secondary: '#44515d',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
      },
    },
    MuiSnackbarContent: {
      action: {
        color: '#ffffff',
      },
    },
  },
});

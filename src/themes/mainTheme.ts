import { createMuiTheme } from '@material-ui/core';

export const BACKGROUND_COLOR = '#ffffff';
export const TEXT_COLOR = '#44515d';
export const LINE_COLOR = '#3d4349';
export const LINK_COLOR = '#6558f5';
export const BOX_COLOR = '#eeeeff';
export const PRIMARY_BUTTON_COLOR = '#ffffff';
export const PUBLICATION_SELECTOR_COLOR = '#ffffff';

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

import { createMuiTheme } from '@material-ui/core';

// Extend Palette type to allow custom colors
declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    separator: PaletteColor;
    box: PaletteColor;
  }
  interface PaletteOptions {
    separator?: PaletteColorOptions;
    box?: PaletteColorOptions;
  }
}

export default createMuiTheme({
  palette: {
    primary: {
      main: '#6558f5',
    },
    secondary: {
      main: '#96c3ec',
    },
    separator: { main: '#3d4349' },
    box: { main: '#eeeeff' },
    text: {
      secondary: '#44515d',
    },
    background: {
      default: '#fff',
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
    MuiLink: {
      root: {
        color: '#6558f5',
      },
    },
  },
});

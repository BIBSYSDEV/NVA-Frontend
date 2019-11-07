import { createMuiTheme } from '@material-ui/core';

// Extend Palette type to allow custom colors
declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    link: PaletteColor;
    seperator: PaletteColor;
    box: PaletteColor;
  }
  interface PaletteOptions {
    link?: PaletteColorOptions;
    seperator?: PaletteColorOptions;
    box?: PaletteColorOptions;
  }
}

export default createMuiTheme({
  palette: {
    primary: {
      main: '#6558f5',
    },
    link: { main: '#6558f5' },
    seperator: { main: '#3d4349' },
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
  },
});

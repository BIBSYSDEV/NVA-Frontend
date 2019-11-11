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

enum Colors {
  Primary = '#6558f5',
  Secondary = '#96c3ec',
  Background = '#fff',
  Box = '#eeeeff',
  Link = '#6558f5',
  Separator = '#3d4349',
  SecondaryText = '#44515d',
  ExpandedPanel = '#b2acfa',
}

export default createMuiTheme({
  palette: {
    primary: {
      main: Colors.Primary,
    },
    secondary: {
      main: Colors.Secondary,
    },
    separator: { main: Colors.Separator },
    box: { main: Colors.Box },
    text: {
      secondary: Colors.SecondaryText,
    },
    background: {
      default: Colors.Background,
    },
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
      },
    },
    MuiSnackbar: {
      root: {
        color: '#ffffff',
      },
    },
    MuiSnackbarContent: {
      root: {
        color: Colors.Background,
      },
    },
    MuiLink: {
      root: {
        color: Colors.Link,
      },
    },
    MuiExpansionPanel: {
      root: {
        background: Colors.Secondary,
        '&$expanded': {
          background: Colors.ExpandedPanel,
        },
      },
    },
    MuiExpansionPanelDetails: {
      root: { background: Colors.ExpandedPanel },
    },
  },
});

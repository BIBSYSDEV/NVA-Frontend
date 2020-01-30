import { createMuiTheme } from '@material-ui/core';

// Extend Palette type to allow custom colors
declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    separator: PaletteColor;
    box: PaletteColor;
    danger: PaletteColor;
  }
  interface PaletteOptions {
    separator?: PaletteColorOptions;
    box?: PaletteColorOptions;
    danger?: PaletteColorOptions;
  }
}

enum Colors {
  Primary = '#6558f5',
  Secondary = '#96c3ec',
  Background = '#fff',
  Box = '#eeeeff',
  Link = '#6558f5',
  Separator = '#3d4349',
  PrimaryText = 'rgba(0, 0, 0, 0.87)',
  SecondaryText = '#44515d',
  ExpandedPanel = '#b2acfa',
  TabBackground = '#f3c19d',
  Disabled = '#bbb',
  Danger = '#ff5555',
}

export default createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      main: Colors.Primary,
    },
    secondary: {
      main: Colors.Secondary,
    },
    separator: { main: Colors.Separator },
    box: {
      main: Colors.Box,
    },
    danger: { main: Colors.Danger },
    text: {
      primary: Colors.PrimaryText,
      secondary: Colors.SecondaryText,
      disabled: Colors.Disabled,
    },
    background: {
      default: Colors.Background,
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      lineHeight: '4rem',
    },
    h2: {
      fontSize: '2rem',
      lineHeight: '3rem',
    },
    h3: {
      fontSize: '1.5rem',
      lineHeight: '3rem',
    },
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
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
    MuiInputBase: {
      root: {
        background: Colors.Background,
      },
    },
    MuiTab: {
      root: {
        background: Colors.TabBackground,
      },
      textColorPrimary: {
        '&$selected': {
          color: Colors.PrimaryText,
          fontWeight: 'bold',
        },
      },
    },
    MuiTextField: {
      root: {
        marginTop: '1rem',
      },
    },
  },
});

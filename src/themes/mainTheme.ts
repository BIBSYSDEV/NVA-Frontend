import { createMuiTheme } from '@material-ui/core';
import i18n from '../translations/i18n';
import { getTranslatedLabelForDisplayedRows } from '../utils/pagination';

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
  Secondary = '#ff5555',
  Background = '#fff',
  Box = '#eeeeff',
  Link = '#6558f5',
  Separator = '#3d4349',
  PrimaryText = 'rgba(0, 0, 0, 0.87)',
  SecondaryText = '#44515d',
  CollapsedPanel = '#96c3ec',
  ExpandedPanel = '#b2acfa',
  TabBackground = '#f3c19d',
  Disabled = '#bbb',
  Danger = '#ff5555',
  DangerLight = '#ffbbbb',
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
    danger: { main: Colors.Danger, light: Colors.DangerLight },
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
    fontFamily: 'sans-serif',
    h1: {
      fontSize: '3rem',
      fontFamily: 'serif',
    },
    h2: { fontSize: '2.5rem' },
    h3: { fontSize: '2.1rem' },
    h4: { fontSize: '1.8rem' },
    h5: { fontSize: '1.5rem' },
    h6: { fontSize: '1.2rem' },
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
      },
    },
    MuiLink: {
      root: {
        color: Colors.Link,
      },
    },
    MuiAccordion: {
      root: {
        background: Colors.CollapsedPanel,
        '&$expanded': {
          background: Colors.ExpandedPanel,
        },
      },
    },
    MuiAccordionDetails: {
      root: { background: Colors.ExpandedPanel },
    },
    MuiInputBase: {
      root: {
        background: Colors.Background,
      },
    },
    MuiTab: {
      wrapper: {
        flexDirection: 'row-reverse',
      },
      labelIcon: {
        minHeight: undefined,
        paddingTop: undefined,
      },
      textColorPrimary: {
        '&$selected': {
          color: Colors.PrimaryText,
          fontWeight: 'bold',
        },
      },
    },
    MuiCard: {
      root: {
        backgroundColor: Colors.Box,
      },
    },
    MuiTextField: {
      root: {
        marginTop: '1rem',
      },
    },
  },
  props: {
    MuiTablePagination: {
      labelRowsPerPage: i18n.t('common:table_pagination.rows_per_page'),
      labelDisplayedRows: ({ from, to, count }) => getTranslatedLabelForDisplayedRows(from, to, count),
      backIconButtonText: i18n.t('common:table_pagination.previous_page'),
      nextIconButtonText: i18n.t('common:table_pagination.next_page'),
    },
  },
});

import { createMuiTheme } from '@material-ui/core';
import i18n from '../translations/i18n';
import { getTranslatedLabelForDisplayedRows } from '../utils/pagination';
import { merriweatherRegular, barlowRegular } from './fonts';

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
  Primary = '#0010A4',
  SecondaryDark = '#E99210',
  SecondaryLight = '#FFDAA2',
  SecondaryMain = '#FFB546',
  Background = '#fff',
  Box = '#f5f5f5',
  Link = '#06f',
  Separator = '#3d4349',
  PrimaryText = 'rgba(0, 0, 0, 0.87)',
  SecondaryText = '#44515d',
  Panel = '#A9D8B8',
  Disabled = '#bbb',
  Danger = '#ff5555',
  Header = '#ffd3d3',
  Indicator = '#FFB546',
}

const theme = createMuiTheme({
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
      light: Colors.SecondaryLight,
      main: Colors.SecondaryMain,
      dark: Colors.SecondaryDark,
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
    fontFamily: 'Barlow,  sans-serif',
    h1: {
      fontFamily: 'Merriweather, serif',
      fontSize: '2.1rem',
    },
    h2: {
      fontFamily: 'Merriweather, serif',
      fontSize: '1.8rem',
    },
    h3: {
      fontFamily: 'Merriweather, serif',
      fontSize: '1.6rem',
    },
    h4: {
      fontFamily: 'Merriweather, serif',
      fontSize: '1.4rem',
    },
  },
  overrides: {
    MuiAccordion: {
      root: {
        background: Colors.Panel,
      },
    },
    MuiAccordionDetails: {
      root: { background: Colors.Panel },
    },
    MuiAppBar: {
      root: { background: Colors.Header },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
      },
    },
    MuiCard: {
      root: {
        backgroundColor: Colors.Box,
      },
    },
    MuiCssBaseline: {
      '@global': {
        '@font-face': [merriweatherRegular, barlowRegular],
      },
    },
    MuiInputBase: {
      root: {
        background: Colors.Background,
      },
    },
    MuiLink: {
      root: {
        color: Colors.Link,
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
    MuiTabs: {
      indicator: {
        backgroundColor: Colors.Indicator,
      },
    },
    MuiTextField: {
      root: {
        marginTop: '1rem',
      },
    },
    MuiFormLabel: {
      asterisk: {
        color: Colors.Danger,
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

export default theme;

// Default props in theme are not supported for components still in /lab
export const autocompleteTranslationProps = {
  noOptionsText: i18n.t('common:no_hits'),
  loadingText: `${i18n.t('common:loading')}...`,
  clearText: i18n.t('common:clear'),
  closeText: i18n.t('common:close'),
  openText: i18n.t('common:open'),
};

export const datePickerTranslationProps = {
  cancelLabel: i18n.t('common:cancel'),
  okLabel: i18n.t('common:select'),
};

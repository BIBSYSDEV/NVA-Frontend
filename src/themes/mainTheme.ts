import { createMuiTheme } from '@material-ui/core';
import i18n from '../translations/i18n';
import { getTranslatedLabelForDisplayedRows } from '../utils/pagination';
import { merriweatherRegular, barlowRegular } from './fonts';

// Extend Palette type to allow custom colors
declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    box: PaletteColor;
  }
  interface PaletteOptions {
    box?: PaletteColorOptions;
  }
}

// Colors: https://www.figma.com/file/3hggk6SX2ca81U8kwaZKFs/Farger-NVA
enum Color {
  Primary = '#0010A4',
  SecondaryDark = '#E99210',
  SecondaryLight = '#FFDAA2',
  SecondaryMain = '#FFB546',
  Background = '#fff',
  Box = '#f5f5f5',
  Link = '#06f',
  PrimaryText = 'rgba(0, 0, 0, 0.87)',
  SecondaryText = '#44515d',
  Panel = '#A9D8B8',
  Disabled = '#bbb',
  Header = '#ffd3d3',
  ErrorLight = '#EE7575',
  ErrorMain = '#C2363D',
  SuccessDark = '#008958',
  SuccessMain = '#08B677',
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
      main: Color.Primary,
    },
    secondary: {
      light: Color.SecondaryLight,
      main: Color.SecondaryMain,
      dark: Color.SecondaryDark,
    },
    box: {
      main: Color.Box,
    },
    error: {
      main: Color.ErrorMain,
      light: Color.ErrorLight,
    },
    success: {
      main: Color.SuccessMain,
      dark: Color.SuccessDark,
    },
    text: {
      primary: Color.PrimaryText,
      secondary: Color.SecondaryText,
      disabled: Color.Disabled,
    },
    background: {
      default: Color.Background,
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
        background: Color.Panel,
      },
    },
    MuiAppBar: {
      root: { background: Color.Header },
    },
    MuiCard: {
      root: {
        backgroundColor: Color.Box,
      },
    },
    MuiCssBaseline: {
      '@global': {
        '@font-face': [merriweatherRegular, barlowRegular],
      },
    },
    MuiInputBase: {
      root: {
        background: Color.Background,
      },
    },
    MuiLink: {
      root: {
        color: Color.Link,
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
          color: Color.PrimaryText,
          fontWeight: 'bold',
        },
      },
    },
    MuiTextField: {
      root: {
        marginTop: '1rem',
      },
    },
    MuiFormLabel: {
      asterisk: {
        color: Color.ErrorMain,
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

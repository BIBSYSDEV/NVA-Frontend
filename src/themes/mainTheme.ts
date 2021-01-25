import { createMuiTheme } from '@material-ui/core';
import { PaletteColor, PaletteColorOptions, SimplePaletteColorOptions } from '@material-ui/core/styles/createPalette';
import i18n from '../translations/i18n';
import { getTranslatedLabelForDisplayedRows } from '../utils/pagination';
import { Color } from './colors';

// Extend Palette type to allow custom colors
declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    box: PaletteColor;
    section: ExtendedPalette;
  }
  interface PaletteOptions {
    box?: PaletteColorOptions;
    section?: ExtendedPaletteOptions;
  }

  interface ExtendedPalette extends PaletteColor {
    megaLight: string;
    megaDark: string;
  }

  interface ExtendedPaletteOptions extends SimplePaletteColorOptions {
    megaLight?: string;
    megaDark?: string;
  }
}

enum Font {
  Barlow = 'Barlow,  sans-serif',
  Merriweather = 'Merriweather, serif',
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
      main: Color.BlueMain,
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
      default: Color.White,
    },
    section: {
      megaLight: Color.BlueMegaLight,
      light: Color.BlueLight,
      main: Color.BlueMain,
      dark: Color.BlueDark,
      megaDark: Color.BlueMegaDark,
    },
  },
  typography: {
    fontFamily: Font.Barlow,
    h1: {
      fontFamily: Font.Merriweather,
      fontSize: '3rem',
      fontWeight: 400,
    },
    h2: {
      fontFamily: Font.Merriweather,
      fontSize: '2.25rem',
      fontWeight: 400,
    },
    h3: {
      fontFamily: Font.Merriweather,
      fontSize: '1.5rem',
      fontWeight: 400,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },

    subtitle2: {
      fontWeight: 700,
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
    MuiInputBase: {
      root: {
        background: Color.White,
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
      root: {
        color: Color.Black,
        '&.Mui-focused': {
          color: Color.Black,
        },
        '&.Mui-error': {
          color: Color.ErrorMain,
        },
      },
    },
    MuiFilledInput: {
      root: {
        backgroundColor: Color.White,
        '&.Mui-focused': {
          backgroundColor: Color.White,
        },
        '&:hover': {
          backgroundColor: Color.White,
        },
      },
    },
    MuiFormHelperText: {
      root: {
        color: Color.Black,
        '&.Mui-error': {
          color: Color.Black,
          backgroundColor: Color.ErrorLight,
          margin: 0,
          padding: '0.25rem 0.75rem',
        },
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

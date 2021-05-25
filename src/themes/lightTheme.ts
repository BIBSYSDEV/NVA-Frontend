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

  interface TypeBackground {
    footer: string;
    statusBar: string;
  }

  interface ExtendedPalette extends PaletteColor {
    megaLight: string;
    megaDark: string;
    black: string;
  }

  interface ExtendedPaletteOptions extends SimplePaletteColorOptions {
    megaLight?: string;
    megaDark?: string;
    black?: string;
  }
}

enum Font {
  Barlow = 'Barlow, sans-serif',
  Crimson = 'Crimson Text, serif',
}

const lightTheme = createMuiTheme({
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
      footer: Color.Footer,
      statusBar: Color.SecondaryMegaLight,
    },
    section: {
      megaLight: Color.BlueMegaLight,
      light: Color.BlueLight,
      main: Color.BlueMain,
      dark: Color.BlueDark,
      megaDark: Color.BlueMegaDark,
      black: Color.Black,
    },
  },
  typography: {
    fontFamily: Font.Barlow,
    h1: {
      fontFamily: Font.Crimson,
      fontSize: '3rem',
      fontWeight: 400,
    },
    h2: {
      fontFamily: Font.Crimson,
      fontSize: '2.25rem',
      fontWeight: 400,
    },
    h3: {
      fontFamily: Font.Crimson,
      fontSize: '1.5rem',
      fontWeight: 400,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    overline: {
      fontSize: '0.8rem',
    },
    subtitle2: {
      fontSize: '0.8rem',
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
    MuiButton: {
      outlinedSecondary: {
        color: Color.PrimaryText,
      },
      containedSecondary: {
        '&:disabled': {
          background: Color.SecondaryLight,
        },
      },
    },
    MuiCard: {
      root: {
        backgroundColor: Color.Box,
      },
    },
    MuiInputBase: {
      root: {
        background: Color.White,

        "& div[class*='MuiAutocomplete-tag']": {
          // TODO: Set this in MuiAutocomplete.tag when Autocomplete is added to MUI core
          margin: '0.5rem 0 !important',
          '&:not(:last-child)': {
            marginRight: '0.5rem !important',
          },
        },
      },
    },
    MuiLink: {
      root: {
        color: Color.PrimaryText,
      },
      underlineHover: {
        textDecoration: 'underline',
        textDecorationColor: Color.SecondaryMain,
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
        fontWeight: 'bold',
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
    MuiTypography: {
      color: 'textPrimary',
    },
    MuiTablePagination: {
      labelRowsPerPage: i18n.t('common:table_pagination.rows_per_page'),
      labelDisplayedRows: ({ from, to, count }) => getTranslatedLabelForDisplayedRows(from, to, count),
      backIconButtonText: i18n.t('common:table_pagination.previous_page'),
      nextIconButtonText: i18n.t('common:table_pagination.next_page'),
    },
  },
});

export default lightTheme;

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

export const paginationTranslationProps = (type: string, page: number) => {
  if (type === 'previous') {
    return i18n.t('common:go_to_previous_page');
  } else if (type === 'next') {
    return i18n.t('common:go_to_next_page');
  } else if (type === 'page') {
    return i18n.t('common:go_to_page', { page });
  }
  return '';
};

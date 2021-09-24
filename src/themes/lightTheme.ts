import { CalendarPickerView } from '@mui/lab';
import { ParseableDate } from '@mui/lab/internal/pickers/constants/prop-types';
import { createTheme } from '@mui/material';
import { PaletteColor, PaletteColorOptions, SimplePaletteColorOptions } from '@mui/material/styles';
import i18n from '../translations/i18n';
import { getTranslatedLabelForDisplayedRows } from '../utils/pagination';
import { Color } from './colors';

// Extend Palette type to allow custom colors
declare module '@mui/material/styles/createPalette' {
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

export const lightTheme = createTheme({
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
      fontSize: '0.75rem',
      fontWeight: 600,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 700,
    },
    caption: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: Color.Panel,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { background: Color.Header },
      },
    },
    MuiButton: {
      styleOverrides: {
        outlinedSecondary: {
          color: Color.PrimaryText,
        },
        containedSecondary: {
          '&:disabled': {
            background: Color.SecondaryLight,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: Color.Box,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          background: Color.White,

          "& div[class*='MuiAutocomplete-tag']": {
            // TODO: Set this in overrides.MuiAutocomplete.tag when Autocomplete is added to MUI core
            margin: '0.5rem 0 !important',
            '&:not(:last-child)': {
              marginRight: '0.5rem !important',
            },
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: Color.PrimaryText,
        },
        underlineHover: {
          textDecoration: 'underline',
          textDecorationColor: Color.SecondaryMain,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          flexDirection: 'row-reverse',
        },
        textColorPrimary: {
          '&.Mui-selected': {
            color: Color.PrimaryText,
            fontWeight: 'bold',
          },
        },
      },
    },
    MuiTablePagination: {
      defaultProps: {
        labelRowsPerPage: i18n.t('common:table_pagination.rows_per_page'),
        labelDisplayedRows: ({ from, to, count }) => getTranslatedLabelForDisplayedRows(from, to, count),
        backIconButtonProps: { title: i18n.t('common:table_pagination.previous_page') },
        nextIconButtonProps: { title: i18n.t('common:table_pagination.next_page') },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginTop: '1rem',
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        color: 'textPrimary',
      },
    },
    MuiFormLabel: {
      styleOverrides: {
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
    },
    MuiFilledInput: {
      styleOverrides: {
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
    },
    MuiFormHelperText: {
      styleOverrides: {
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
    MuiMenuItem: {
      styleOverrides: {
        gutters: {
          paddingRight: '2rem',
        },
      },
    },
  },
});

// Default props in theme are not supported for components still in /lab
export const autocompleteTranslationProps = {
  noOptionsText: i18n.t('common:no_hits'),
  loadingText: `${i18n.t('common:loading')}...`,
  clearText: i18n.t('common:clear'),
  closeText: i18n.t('common:close'),
  openText: i18n.t('common:open'),
};

export const datePickerTranslationProps = {
  cancelText: i18n.t('common:cancel'),
  clearText: i18n.t('common:clear'),
  getOpenDialogAriaText: (value: ParseableDate<Date | null>) =>
    value
      ? i18n.t('registration:description.date_picker.open_dialog', { date: new Date(value).toLocaleDateString() })
      : i18n.t('registration:description.date_picker.choose_date'),
  getViewSwitchingButtonText: (currentView: CalendarPickerView) => {
    switch (currentView) {
      case 'day':
      case 'month':
        return i18n.t('registration:description.date_picker.go_to_year_view');
      case 'year':
        return i18n.t('registration:description.date_picker.go_to_calendar_view');
    }
  },
  leftArrowButtonText: i18n.t('registration:description.date_picker.previous_month'),
  rightArrowButtonText: i18n.t('registration:description.date_picker.next_month'),
  todayText: i18n.t('registration:description.date_picker.today'),
  toolbarTitle: i18n.t('registration:description.date_picker.select_date'),
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

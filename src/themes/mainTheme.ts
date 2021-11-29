import { CalendarPickerView, DatePickerProps } from '@mui/lab';
import { createTheme } from '@mui/material';
import i18n from '../translations/i18n';
import { getTranslatedLabelForDisplayedRows } from '../utils/pagination';

// Colors: https://www.figma.com/file/3hggk6SX2ca81U8kwaZKFs/Farger-NVA
enum Color {
  Black = '#222',
  ErrorLight = '#FF8888',
  ErrorMain = '#C2363D',
  Paper = '#faf7f4',
  PrimaryMain = '#0e6d82',
  SecondaryMain = '#FFB546',
  SuccessMain = '#08B677',
  TextPrimary = 'rgba(0, 0, 0, 0.87)',
  White = '#fff',
}

enum Font {
  Barlow = 'Barlow, sans-serif',
  Crimson = 'Crimson Text, serif',
}

export const mainTheme = createTheme({
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
      main: Color.PrimaryMain,
    },
    secondary: {
      main: Color.SecondaryMain,
    },
    error: {
      main: Color.ErrorMain,
      light: Color.ErrorLight,
    },
    success: {
      main: Color.SuccessMain,
    },
    background: {
      default: Color.White,
      paper: Color.Paper,
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
    MuiAutocomplete: {
      styleOverrides: {
        tag: {
          margin: '0.5rem 0',
          '&:not(:last-child)': {
            marginRight: '0.5rem',
          },
        },
      },
      defaultProps: {
        noOptionsText: i18n.t('common:no_hits'),
        loadingText: `${i18n.t('common:loading')}...`,
        clearText: i18n.t('common:clear'),
        closeText: i18n.t('common:close'),
        openText: i18n.t('common:open'),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: '100%',
          padding: '0.4rem 0',
        },
        label: {
          whiteSpace: 'normal', // Allow multiline chips
        },
      },
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: Color.TextPrimary,
        },
        underlineAlways: {
          textDecorationColor: Color.SecondaryMain,
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          opacity: 0.65,
          textTransform: 'uppercase',
          fontSize: '1rem',
          '&.Mui-active': {
            color: Color.PrimaryMain,
            opacity: 1,
          },
          '&.Mui-error': {
            color: Color.ErrorMain,
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
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: Color.Black,
        },
        gutters: {
          paddingRight: '2rem',
        },
      },
    },
    MuiPagination: {
      defaultProps: {
        getItemAriaLabel: (type: string, page: number) =>
          type === 'previous'
            ? i18n.t('common:go_to_previous_page')
            : type === 'next'
            ? i18n.t('common:go_to_next_page')
            : type === 'page'
            ? i18n.t('common:go_to_page', { page })
            : '',
      },
    },
  },
});

// Default props in theme are not supported for components still in /lab
export const datePickerTranslationProps: Pick<
  DatePickerProps,
  | 'cancelText'
  | 'clearText'
  | 'getOpenDialogAriaText'
  | 'getViewSwitchingButtonText'
  | 'leftArrowButtonText'
  | 'rightArrowButtonText'
  | 'todayText'
  | 'toolbarTitle'
> = {
  cancelText: i18n.t('common:cancel'),
  clearText: i18n.t('common:clear'),
  getOpenDialogAriaText: (value) =>
    value
      ? i18n.t('registration:description.date_picker.open_dialog', {
          date: new Date(value as string).toLocaleDateString(),
        })
      : i18n.t('registration:description.date_picker.choose_date'),
  getViewSwitchingButtonText: (currentView: CalendarPickerView) =>
    currentView === 'year'
      ? i18n.t('registration:description.date_picker.go_to_calendar_view')
      : i18n.t('registration:description.date_picker.go_to_year_view'),
  leftArrowButtonText: i18n.t('registration:description.date_picker.previous_month'),
  rightArrowButtonText: i18n.t('registration:description.date_picker.next_month'),
  todayText: i18n.t('registration:description.date_picker.today'),
  toolbarTitle: i18n.t('registration:description.date_picker.select_date'),
};

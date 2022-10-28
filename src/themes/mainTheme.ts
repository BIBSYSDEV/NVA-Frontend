import { createTheme, SxProps } from '@mui/material';
import { nbNO as coreNbNo, enUS as coreEnUs } from '@mui/material/locale';
import { nbNO as pickersNbNo, enUS as pickersEnUs } from '@mui/x-date-pickers';
import i18n from '../translations/i18n';

// Colors: https://www.figma.com/file/3hggk6SX2ca81U8kwaZKFs/Farger-NVA
enum Color {
  AlternativeBackground = '#f3f0ed',
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

const coreLocale = i18n.language === 'eng' ? coreEnUs : coreNbNo;
const pickersLocale = i18n.language === 'eng' ? pickersEnUs : pickersNbNo;

export const mainTheme = createTheme(
  {
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
        contrastText: Color.White,
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
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: `${Color.TextPrimary} !important`,
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
      MuiTableHead: { styleOverrides: { root: { th: { background: Color.AlternativeBackground } } } },
      MuiTablePagination: {
        defaultProps: {
          showFirstButton: true,
          showLastButton: true,
        },
      },
      MuiTooltip: { defaultProps: { arrow: true } },
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
            '&.Mui-disabled': {
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
    },
  },
  pickersLocale,
  coreLocale
);

export const alternatingTableRowColor: SxProps = {
  tr: {
    background: Color.AlternativeBackground,
    '&:nth-of-type(odd)': {
      background: Color.White,
    },
  },
};

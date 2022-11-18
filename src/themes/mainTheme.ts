import { createTheme, SxProps } from '@mui/material';
import { nbNO as coreNbNo, enUS as coreEnUs } from '@mui/material/locale';
import { nbNO as pickersNbNo, enUS as pickersEnUs } from '@mui/x-date-pickers';
import i18n from '../translations/i18n';

// Colors: https://www.figma.com/file/3hggk6SX2ca81U8kwaZKFs/Farger-NVA
enum Color {
  AlternativeBackground = '#C2D3EA',
  Black = '#222',
  ErrorLight = '#FF8888',
  ErrorMain = '#C2363D',
  Paper = '#faf7f4',
  PrimaryMain = '#0F0035',
  SecondaryMain = '#EDE2C7',
  SuccessMain = '#08B677',
  TextPrimary = 'rgba(0, 0, 0, 0.87)',
  White = '#fff',
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
        light: Color.AlternativeBackground,
        main: Color.PrimaryMain,
        contrastText: Color.White,
      },
      secondary: {
        light: '#FEFBF3',
        main: '#F9F4E6',
        dark: '#EDE2C7',
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
      h1: {
        fontSize: '1.25rem',
        fontWeight: 700,
        textTransform: 'uppercase',
      },
      h2: {
        fontSize: '1rem',
        fontWeight: 700,
      },
      h3: {
        fontSize: '1rem',
        fontWeight: 700,
        textTransform: 'uppercase',
      },
      h4: {
        fontSize: '1rem',
        fontWeight: 400,
      },
      overline: {
        fontSize: '0.75rem',
        fontWeight: 700,
      },
      subtitle1: {
        fontSize: '0.875rem',
        fontWeight: 700,
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 700,
        textDecoration: 'underline',
      },
      body1: {
        fontSize: '0.875rem',
        fontWeight: 400,
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 400,
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
      MuiTableHead: { styleOverrides: { root: { th: { background: 'secondary.light' } } } },
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
    bgcolor: 'secondary.dark',
    '&:nth-of-type(odd)': {
      bgcolor: 'secondary.main',
    },
  },
};

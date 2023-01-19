import { createTheme, SxProps, PaletteColorOptions } from '@mui/material';
import { nbNO as coreNbNo, enUS as coreEnUs } from '@mui/material/locale';
import { nbNO as pickersNbNo, enUS as pickersEnUs } from '@mui/x-date-pickers';
import i18n from '../translations/i18n';

// Colors: https://www.figma.com/file/3hggk6SX2ca81U8kwaZKFs/Farger-NVA
enum Color {
  Black = '#222',
  ErrorMain = '#AC0303',
  PrimaryMain = '#0F0035',
  SecondaryLight = '#FEFBF3',
  SecondaryMain = '#F9F4E6',
  SecondaryDark = '#EDE2C7',
  SuccessMain = '#025810',
  InfoMain = '#4367F6',
  InfoLight = '#C2D3EA',
  PrimaryLight = '#0D4DAD',
  TextPrimary = 'rgba(0, 0, 0, 0.87)',
  White = '#fff',
  Registration = '#DAC48E',
  Person = '#B3D6D9',
  Project = '#E48F8F',
}

const coreLocale = i18n.language === 'eng' ? coreEnUs : coreNbNo;
const pickersLocale = i18n.language === 'eng' ? pickersEnUs : pickersNbNo;

declare module '@mui/material/styles' {
  interface Palette {
    registration: PaletteColorOptions;
    person: PaletteColorOptions;
    project: PaletteColorOptions;
  }
  interface PaletteOptions {
    registration?: PaletteColorOptions;
    person?: PaletteColorOptions;
    project?: PaletteColorOptions;
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    registration: true;
    person: true;
    project: true;
  }
}

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
        light: Color.PrimaryLight,
        contrastText: Color.White,
      },
      secondary: {
        light: Color.SecondaryLight,
        main: Color.SecondaryMain,
        dark: Color.SecondaryDark,
      },
      error: {
        main: Color.ErrorMain,
      },
      success: {
        main: Color.SuccessMain,
      },
      info: {
        main: Color.InfoMain,
        light: Color.InfoLight,
      },
      grey: {
        400: '#d9d9d9',
      },
      registration: {
        main: Color.Registration,
      },
      person: {
        main: Color.Person,
      },
      project: {
        main: Color.Project,
      },
      background: {
        default: Color.White,
        paper: Color.SecondaryMain,
      },
    },
    typography: {
      h1: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1rem',
        fontWeight: 700,
      },
      h4: {
        fontSize: '0.9rem',
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
            textDecorationColor: Color.PrimaryMain,
          },
        },
      },
      MuiStepIcon: {
        styleOverrides: {
          root: {
            fill: Color.PrimaryLight,
            opacity: 0.6,
            '&.Mui-active': {
              opacity: 1,
            },
            '&.Mui-error': {
              fill: Color.ErrorMain,
            },
          },
        },
      },
      MuiStepLabel: {
        styleOverrides: {
          label: {
            opacity: 0.6,
            textTransform: 'uppercase',
            fontSize: '1rem',
            color: Color.PrimaryLight,
            '&.Mui-active': {
              color: Color.PrimaryLight,
              fontWeight: 600,
              borderBottom: '0.1875rem solid',
              mb: '-0.1875rem', //prevents text from 'popping'
              boxShadow: '-1px 7px 4px -3px rgba(0,0,0,0.3)',
              opacity: 1,
            },
            '&.Mui-completed': {
              color: Color.PrimaryLight,
            },
            '&.Mui-error': {
              color: Color.ErrorMain,
            },
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            th: {
              fontWeight: 600,
            },
          },
        },
      },
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
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '0.25rem',
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
    bgcolor: 'secondary.main',
    '&:nth-of-type(odd)': {
      bgcolor: 'secondary.light',
    },
  },
};

import { createTheme, PaletteColorOptions, SxProps } from '@mui/material';
import { enUS as coreEnUs, nbNO as coreNbNo, nnNO as coreNnNo } from '@mui/material/locale';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import i18n from '../translations/i18n';

// Colors: https://www.figma.com/file/3hggk6SX2ca81U8kwaZKFs/Farger-NVA
enum Color {
  Black = '#222',
  CentralImportMain = '#D9D9D9',
  CentralImportLight = '#EFEEED',
  ErrorMain = '#AC0303',
  PrimaryMain = '#0F0035',
  SecondaryLight = '#F9F4E6',
  SecondaryMain = '#EDE2C7',
  SecondaryDark = '#D3C9AF',
  SuccessMain = '#025810',
  InfoMain = '#0B408F',
  InfoLight = '#C2D3EA',
  PrimaryLight = '#0D4DAD',
  TextPrimary = 'rgba(0, 0, 0, 0.87)',
  White = '#fff',
  DoiRequest = '#FFAA8E',
  DoiRequestLight = '#FFE2DA',
  GeneralSupportCase = '#7E9DCC',
  Registration = '#DAC48E',
  Person = '#B3D6D9',
  Project = '#E48F8F',
  PublishingRequest = '#FFD27B',
  PublishingRequestLight = '#FFF0D3',
  NviMain = '#EE95EA',
  NviLight = '#F8D3F6',
}

const coreLocale = i18n.language === 'eng' ? coreEnUs : i18n.language === 'nno' ? coreNnNo : coreNbNo;

declare module '@mui/material/styles' {
  interface Palette {
    registration: PaletteColorOptions;
    person: PaletteColorOptions;
    project: PaletteColorOptions;
    publishingRequest: PaletteColorOptions;
    doiRequest: PaletteColorOptions;
    generalSupportCase: PaletteColorOptions;
    centralImport: PaletteColorOptions;
    nvi: PaletteColorOptions;
  }
  interface PaletteOptions {
    registration?: PaletteColorOptions;
    person?: PaletteColorOptions;
    project?: PaletteColorOptions;
    publishingRequest?: PaletteColorOptions;
    doiRequest?: PaletteColorOptions;
    generalSupportCase?: PaletteColorOptions;
    centralImport?: PaletteColorOptions;
    nvi?: PaletteColorOptions;
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    registration: true;
    person: true;
    project: true;
    publishingRequest: true;
    doiRequest: true;
    generalSupportCase: true;
  }
}

const dialogTitleId = 'dialog-title-id';
export const dialogDescriptionId = 'dialog-description-id';

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
        300: '#EEEEEE',
        400: '#DDDDDD',
        500: '#CCCCCC',
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
      centralImport: {
        main: Color.CentralImportMain,
        light: Color.CentralImportLight,
      },
      publishingRequest: {
        main: Color.PublishingRequest,
        light: Color.PublishingRequestLight,
      },
      doiRequest: {
        main: Color.DoiRequest,
        light: Color.DoiRequestLight,
      },
      generalSupportCase: {
        main: Color.GeneralSupportCase,
        light: Color.InfoLight,
      },
      nvi: {
        main: Color.NviMain,
        light: Color.NviLight,
      },
      background: {
        default: Color.White,
        paper: Color.SecondaryLight,
      },
    },
    typography: {
      h1: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '1.125rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '0.9rem',
        fontWeight: 600,
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
      MuiAccordion: {
        defaultProps: { slotProps: { heading: { component: 'div' } } },
      },
      MuiAutocomplete: {
        styleOverrides: {
          inputRoot: {
            gap: '0rem 0.5rem',
          },
          tag: {
            marginTop: '0.4rem',
            marginBottom: '0.4rem',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          fieldset: {
            border: 'none',
            padding: 0,
            margin: 0,
          },
          legend: {
            padding: 0,
          },
        },
      },
      MuiDatePicker: {
        defaultProps: {
          views: ['year', 'month', 'day'],
          /*
           * Use fallback to the old DOM structure for DatePicker since the new way introduces
           * problems to Cypress tests, where they are not able to enter a value to the input
           * field as it is hidden. The old DOM structure has som accessibility issues.
           * Documentation: https://mui.com/x/migration/migration-pickers-v7/#new-dom-structure-for-the-field
           */
          enableAccessibleFieldDOMStructure: false, // TODO: Remove this when we find a solution to the Cypress issue
        },
      },
      MuiMenu: {
        defaultProps: {
          disablePortal: true,
        },
      },
      MuiBadge: {
        defaultProps: { color: 'info' },
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
      MuiDialog: {
        defaultProps: {
          'aria-labelledby': dialogTitleId,
          'aria-describedby': dialogDescriptionId,
        },
      },
      MuiDialogTitle: {
        defaultProps: {
          id: dialogTitleId,
          component: 'h1',
        },
      },
      MuiDialogContent: {
        defaultProps: {
          id: dialogDescriptionId,
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: Color.TextPrimary,
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
            opacity: 0.7,
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
            opacity: 0.7,
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
      MuiInputBase: {
        styleOverrides: {
          inputTypeSearch: {
            '::-webkit-search-cancel-button': {
              WebkitAppearance: 'none', // Avoid redundant clear button for input fields with type="search" on webkit browsers
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
      MuiTooltip: { defaultProps: { arrow: true, enterDelay: 400 } },
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
      MuiPickersFilledInput: {
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
      MuiSkeleton: {
        defaultProps: {
          animation: 'wave',
        },
      },
    },
  },
  coreLocale
);

export const alternatingTableRowColor: SxProps = {
  thead: {
    tr: {
      bgcolor: '#FEFBF3',
    },
  },
  tbody: {
    tr: {
      bgcolor: 'secondary.light',
      '&:nth-of-type(even)': {
        bgcolor: '#FEFBF3',
      },
    },
  },
};

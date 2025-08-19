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
  WarningMain = '#ED6C02',
  WarningLight = '#FFD45A',
  Blue41 = '#004FCF',
  Blue95 = '#E6F0FF',
  Green22 = '#096638',
  Green89 = '#CFF7E2',
  Neutral35 = '#595959',
  Neutral40 = '#656565',
  Neutral46 = '#767676',
  Neutral87 = '#DEDEDE',
  Neutral92 = '#EBEBEB',
  Neutral95 = '#F1F1F1',
  Neutral97 = '#F7F7F7',
  Neutral100 = '#FFFFFF',
  Purple10 = '#0A0132',
  Purple65 = '#7351FB',
  Purple90 = '#D1CDFF',
  Red36 = '#B60203',
  Red96 = '#FFEAE9',
  Yellow50 = '#FFB700',
  Yellow91 = '#FCEED2',
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
    seperator: PaletteColorOptions;
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
    seperator?: PaletteColorOptions;
  }
  // interface PaletteColor {}
  // interface SimplePaletteColorOptions {}
  interface TypeBackground {
    primary?: string;
    neutral?: string;
    info?: string;
    success?: string;
    warning?: string;
    critical?: string;
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
        main: Color.Purple65,
        light: Color.Purple90,
        dark: Color.Purple10,
        contrastText: Color.Neutral100,
      },
      secondary: {
        light: Color.Neutral87,
        main: '#c2bfcb', // TODO: update when design system provides color name
        dark: Color.Neutral46,
      },
      error: {
        main: Color.Red36,
        light: Color.Red96,
      },
      success: {
        main: Color.Green22,
        light: Color.Green89,
      },
      info: {
        main: Color.Blue41,
        light: Color.Blue95,
      },
      warning: {
        main: Color.Yellow50,
        light: Color.Yellow91,
      },
      background: {
        default: Color.Neutral100,
        primary: Color.Neutral95,
        info: Color.Blue95,
        success: Color.Green89,
        warning: Color.Yellow91,
        critical: Color.Red96,
      },
      seperator: {
        main: Color.Neutral40,
        light: Color.Neutral87,
      },
      grey: {
        300: '#EEEEEE',
        400: '#DDDDDD',
        500: '#CCCCCC',
      },
      registration: {
        main: '#f70000',
        light: '#f70000',
      },
      person: {
        main: '#f70000',
        light: '#f70000',
      },
      project: {
        main: '#f70000',
        light: '#f70000',
      },
      centralImport: {
        main: '#f70000',
        light: '#f70000',
      },
      publishingRequest: {
        main: '#f70000',
        light: '#f70000',
      },
      doiRequest: {
        main: '#f70000',
        light: '#f70000',
      },
      generalSupportCase: {
        main: '#f70000',
        light: '#f70000',
      },
      nvi: {
        main: '#f70000',
        light: '#f70000',
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
              borderBottom: '1px solid darkgrey',
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
            textTransform: 'none',
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

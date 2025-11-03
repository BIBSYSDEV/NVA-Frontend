import { createTheme, darken, PaletteColor, PaletteColorOptions, SxProps } from '@mui/material';
import { enUS as coreEnUs, nbNO as coreNbNo, nnNO as coreNnNo } from '@mui/material/locale';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import i18n from '../translations/i18n';

// Colors: https://www.figma.com/file/3hggk6SX2ca81U8kwaZKFs/Farger-NVA
enum Color {
  Black = '#222222',
  White = '#FFFFFF',
  Purple = '#7351FB',
  PurpleLight = '#D1CDFF',
  PurpleDark = '#0A0132',
  TextPrimary = 'rgba(0, 0, 0, 0.87)',
  CentralImportMain = '#D9D9D9',
  Registration = '#EED2AE',
  Person = '#BAD2F7',
  Project = '#E8B8D0',
  Neutral97 = '#F7F7F7',
  Neutral95 = '#F1F1F1',
  Neutral87 = '#DEDEDE',
  Neutral46 = '#767676',
  BlueLight = '#E6F0FF',
  BlueClear = '#75C7F0',
  Blue = '#004FCF',
  Green = '#096638',
  GreenLight = '#CFF7E2',
  Red = '#B60203',
  RedLight = '#FFEAE9',
  YellowLight = '#FCEED2',
  YellowClear = '#FBE774',
  Yellow = '#FFB700',
  Orange = '#FFAC70',
}

const coreLocale = i18n.language === 'eng' ? coreEnUs : i18n.language === 'nno' ? coreNnNo : coreNbNo;

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: PaletteColor;
    registration: PaletteColor;
    person: PaletteColor;
    project: PaletteColor;
    centralImport: PaletteColor;
    neutral87: PaletteColor;
    taskType: {
      publishingRequest: PaletteColor;
      filesApprovalThesis: PaletteColor;
      doiRequest: PaletteColor;
      generalSupportCase: PaletteColor;
    };
  }
  interface PaletteOptions {
    tertiary: PaletteColorOptions;
    registration?: PaletteColorOptions;
    person?: PaletteColorOptions;
    project?: PaletteColorOptions;
    centralImport?: PaletteColorOptions;
    neutral87?: PaletteColorOptions;
    taskType?: {
      publishingRequest?: PaletteColorOptions;
      filesApprovalThesis?: PaletteColorOptions;
      doiRequest?: PaletteColorOptions;
      generalSupportCase?: PaletteColorOptions;
    };
  }
  interface TypeBackground {
    neutral97?: string;
    neutral95?: string;
    neutral87?: string;
    neutral46?: string;
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    tertiary: true;
    registration: true;
    person: true;
    project: true;
    white: true;
    neutral87: true;
  }
}
declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    tertiary: true;
  }
}
declare module '@mui/material/PaginationItem' {
  interface PaginationItemPropsColorOverrides {
    tertiary: true;
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
        main: Color.PurpleDark,
      },
      secondary: {
        main: Color.Purple,
      },
      tertiary: {
        main: Color.PurpleLight,
        dark: darken(Color.PurpleLight, 0.2),
        light: '#F6F4FF',
        contrastText: Color.PurpleDark,
      },
      error: {
        main: Color.Red,
        light: Color.RedLight,
      },
      success: {
        main: Color.Green,
        light: Color.GreenLight,
      },
      info: {
        main: Color.Blue,
        light: Color.BlueLight,
      },
      warning: {
        main: Color.Yellow,
        light: Color.YellowLight,
      },
      grey: {
        300: '#EEEEEE',
        400: '#DDDDDD',
        500: '#CCCCCC',
      },
      registration: {
        main: Color.Registration,
      },
      taskType: {
        publishingRequest: {
          main: Color.YellowClear,
        },
        filesApprovalThesis: {
          main: Color.YellowClear,
        },
        doiRequest: {
          main: Color.Orange,
        },
        generalSupportCase: {
          main: Color.BlueClear,
        },
      },
      person: {
        main: Color.Person,
      },
      project: {
        main: Color.Project,
      },
      centralImport: {
        main: Color.CentralImportMain,
      },
      background: {
        default: Color.Neutral95,
        paper: Color.Neutral97,
        neutral87: Color.Neutral87,
        neutral46: Color.Neutral46,
      },
      neutral87: {
        main: Color.Neutral87,
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
        defaultProps: {
          slotProps: {
            chip: {
              color: 'secondary',
              variant: 'filled',
            },
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
      MuiRadio: {
        defaultProps: { color: 'secondary' },
      },
      MuiCheckbox: {
        defaultProps: { color: 'secondary' },
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
      MuiModal: {
        defaultProps: { color: 'white' },
      },
      MuiMenu: {
        defaultProps: {
          disablePortal: true,
        },
      },
      MuiBadge: {
        defaultProps: { color: 'secondary' },
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
          outlined: {
            color: Color.PurpleDark,
          },
        },
        defaultProps: {
          variant: 'outlined',
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: Color.White,
          },
        },
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
            textDecorationColor: Color.PurpleDark,
          },
        },
      },
      MuiStepIcon: {
        styleOverrides: {
          root: {
            fill: Color.Purple,
            opacity: 0.7,
            '&.Mui-active': {
              opacity: 1,
            },
            '&.Mui-error': {
              fill: Color.Red,
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
            color: Color.Purple,
            '&.Mui-active': {
              color: Color.Purple,
              fontWeight: 600,
              borderBottom: '0.1875rem solid',
              mb: '-0.1875rem', //prevents text from 'popping'
              boxShadow: '-1px 7px 4px -3px rgba(0,0,0,0.3)',
              opacity: 1,
            },
            '&.Mui-completed': {
              color: Color.Purple,
            },
            '&.Mui-error': {
              color: Color.Red,
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
            color: Color.Red,
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
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: Color.PurpleDark,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: Color.PurpleDark,
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
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: Color.PurpleDark,
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
      bgcolor: Color.White,
    },
  },
  tbody: {
    tr: {
      bgcolor: Color.Neutral97,
      '&:nth-of-type(even)': {
        bgcolor: 'white',
      },
    },
  },
};

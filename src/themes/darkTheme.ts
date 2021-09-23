import { createTheme } from '@mui/material';
import { Color } from './colors';
import { lightTheme } from './lightTheme';

export const darkTheme = createTheme({
  ...lightTheme,
  palette: {
    ...lightTheme.palette,
    mode: 'dark',
    primary: { main: Color.BlueMegaLight },
    error: { main: Color.ErrorLight },
    text: { primary: Color.White, disabled: Color.Black },
  },
  components: {
    ...lightTheme.components,
    MuiFilledInput: {
      styleOverrides: {
        root: {
          // ...lightTheme.components?.MuiFilledInput?.root,
          '&.Mui-focused': {
            backgroundColor: Color.BlueLight,
          },
          '&:hover': {
            backgroundColor: Color.BlueLight,
          },
          '&.Mui-disabled': {
            backgroundColor: 'rgba(255, 255, 255, 0.60)',
          },
        },
        underline: {
          '&:hover:before': {
            borderBottomColor: Color.BlueMegaLight,
          },
          '&.Mui-disabled:before': {
            borderBottomStyle: 'none',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          // ...lightTheme.overrides?.MuiFormHelperText?.root,
          color: Color.BlueMegaLight,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        ...lightTheme.components?.MuiFormLabel,
        root: {
          color: Color.White,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        ...lightTheme.components?.MuiInputBase,
        root: {
          // ...lightTheme.overrides?.MuiInputBase?.root,
          color: Color.Black,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        ...lightTheme.components?.MuiInputLabel,
        root: {
          // ...lightTheme.overrides?.MuiInputLabel?.root,
          color: Color.Black,
          '&.Mui-focused': {
            color: Color.Black,
          },
          '&.Mui-error': {
            color: Color.ErrorMain,
          },
        },
        asterisk: {
          '&.Mui-error': {
            color: Color.ErrorMain,
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: Color.BlueMegaLight,
        },
        underlineHover: {
          textUnderlineOffset: '0.5rem',
          textDecoration: 'underline',
          textDecorationColor: Color.SecondaryMain,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        ...lightTheme.components?.MuiListItem,
        root: {
          // ...lightTheme.components?.MuiListItem?.root,
          color: Color.Black,
        },
      },
    },
  },
});

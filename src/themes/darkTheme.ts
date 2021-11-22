import { createTheme } from '@mui/material';
import { Color } from './colors';
import { lightTheme } from './lightTheme';

export const darkTheme = createTheme(lightTheme, {
  palette: {
    mode: 'dark',
    primary: { main: Color.BlueMegaLight },
    error: { main: Color.ErrorMain },
    text: { primary: Color.White, disabled: Color.Black },
  },
  components: {
    MuiFilledInput: {
      styleOverrides: {
        root: {
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
          color: Color.BlueMegaLight,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: Color.White,
          '&.Mui-focused': {
            color: Color.White,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: Color.Black,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
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
        root: {
          color: Color.Black,
        },
      },
    },
  },
});

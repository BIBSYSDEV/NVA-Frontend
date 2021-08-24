import { createTheme } from '@material-ui/core';
import { Color } from './colors';
import { lightTheme } from './lightTheme';

export const darkTheme = createTheme({
  ...lightTheme,
  palette: {
    ...lightTheme.palette,
    type: 'dark',
    primary: { main: Color.BlueMegaLight },
    error: { main: Color.ErrorLight },
    text: { primary: Color.White, disabled: Color.Black },
  },
  overrides: {
    ...lightTheme.overrides,
    MuiFilledInput: {
      root: {
        ...lightTheme.overrides?.MuiFilledInput?.root,
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
    MuiFormHelperText: {
      root: {
        ...lightTheme.overrides?.MuiFormHelperText?.root,
        color: Color.BlueMegaLight,
      },
    },
    MuiFormLabel: {
      ...lightTheme.overrides?.MuiFormLabel,
      root: {
        color: Color.White,
      },
    },
    MuiInputBase: {
      ...lightTheme.overrides?.MuiInputBase,
      root: {
        ...lightTheme.overrides?.MuiInputBase?.root,
        color: Color.Black,
      },
    },
    MuiInputLabel: {
      ...lightTheme.overrides?.MuiInputLabel,
      root: {
        ...lightTheme.overrides?.MuiInputLabel?.root,
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
    MuiLink: {
      root: {
        color: Color.BlueMegaLight,
      },
      underlineHover: {
        textUnderlineOffset: '0.5rem',
        textDecoration: 'underline',
        textDecorationColor: Color.SecondaryMain,
      },
    },
    MuiListItem: {
      ...lightTheme.overrides?.MuiListItem,
      root: {
        ...lightTheme.overrides?.MuiListItem?.root,
        color: Color.Black,
      },
    },
  },
});

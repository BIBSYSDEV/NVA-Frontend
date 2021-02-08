import { createMuiTheme } from '@material-ui/core';
import { Color } from './colors';
import lightTheme from './lightTheme';

const darkTheme = createMuiTheme({
  ...lightTheme,
  palette: {
    ...lightTheme.palette,
    type: 'dark',
    primary: { main: Color.BlueMegaLight },
    error: { main: Color.ErrorLight },
    text: { primary: Color.White },
  },
  overrides: {
    ...lightTheme.overrides,
    MuiFilledInput: {
      root: {
        backgroundColor: Color.BlueMegaLight,
        '&.Mui-focused': {
          backgroundColor: Color.BlueMegaLight,
        },
        '&:hover': {
          backgroundColor: Color.BlueMegaLight,
        },
        '&.Mui-disabled': {
          backgroundColor: 'rgba(255, 255, 255, 0.60)',
          // color: Color.Black,
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
      root: {
        '&.Mui-disabled': {
          color: Color.Black,
        },
        '&.Mui-focused:not(.Mui-error)': {
          color: Color.Black,
        },
      },
    },
    MuiInputBase: {
      root: { color: Color.Black },
    },
    MuiInputLabel: {
      root: { color: Color.Black },
    },
    MuiListItem: {
      root: { color: Color.Black },
    },
  },
});

export default darkTheme;

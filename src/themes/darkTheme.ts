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
        ...lightTheme.overrides?.MuiFilledInput?.root,
        '&.Mui-focused': {
          backgroundColor: Color.BlueLight,
        },
        '&:hover': {
          backgroundColor: Color.BlueLight,
        },
        '&.Mui-disabled': {
          backgroundColor: 'rgba(255, 255, 255, 0.60)',
          color: Color.Black,
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

export default darkTheme;

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
      },
    },
    MuiFormHelperText: {
      root: {
        ...lightTheme.overrides?.MuiFormHelperText?.root,
        color: Color.BlueMegaLight,
      },
    },
  },
});

export default darkTheme;

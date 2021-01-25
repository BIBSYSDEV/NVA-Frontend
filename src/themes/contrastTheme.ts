import { createMuiTheme } from '@material-ui/core';
import { Color } from './colors';
import theme from './mainTheme';

const contrastTheme = createMuiTheme({
  ...theme,
  palette: {
    ...theme.palette,
    type: 'dark',
    primary: { main: Color.BlueMegaLight },
    error: { main: Color.ErrorLight },
  },
  overrides: {
    ...theme.overrides,
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
        ...theme.overrides?.MuiFormHelperText?.root,
        color: Color.BlueMegaLight,
      },
    },
  },
});

export default contrastTheme;

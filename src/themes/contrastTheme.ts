import { createMuiTheme } from '@material-ui/core';
import { BackgroundColors, Color } from './colors';
import theme from './mainTheme';

const contrastTheme = createMuiTheme({
  ...theme,
  palette: {
    ...theme.palette,
    type: 'dark',
    primary: { main: BackgroundColors.BlueMegaLight },
    error: { main: Color.ErrorLight },
  },
  overrides: {
    ...theme.overrides,
    MuiFilledInput: {
      root: {
        backgroundColor: BackgroundColors.BlueMegaLight,
        '&.Mui-focused': {
          backgroundColor: BackgroundColors.BlueMegaLight,
        },
        '&:hover': {
          backgroundColor: BackgroundColors.BlueMegaLight,
        },
      },
    },
  },
});

export default contrastTheme;

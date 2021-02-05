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
});

export default darkTheme;

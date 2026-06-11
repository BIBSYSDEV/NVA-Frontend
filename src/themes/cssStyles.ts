import { SxProps } from '@mui/material';
import { Color } from './colors';

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

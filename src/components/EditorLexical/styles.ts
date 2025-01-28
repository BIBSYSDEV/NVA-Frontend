import { styled } from '@mui/system';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { Box, Typography } from '@mui/material';

export const StyledContentEditableContainer = styled(Box)({
  position: 'relative',
});

export const StyledContentEditable = styled(ContentEditable)({
  position: 'relative',
  marginTop: '1rem',
  '>p': {
    margin: '0',
  },
  ':focus-visible': {
    outline: 'none',
  },
});

export const StyledPlaceholder = styled(Typography)({
  position: 'absolute',
  top: '1rem',
});

export const StyledEditor = styled(Box)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#fff',
  borderTopLeftRadius: '4px',
  borderTopRightRadius: '4px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
  // width: '100%',
  padding: '0.5rem',
});

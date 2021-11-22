import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Box, BoxProps, ThemeProvider } from '@mui/material';
import { darkTheme } from '../themes/darkTheme';
import { lightTheme } from '../themes/lightTheme';
import { isBackgroundColorDark } from '../utils/theme-helpers';
import { StyledPageWrapper } from './styled/Wrappers';

interface BakcgroundDivProps {
  backgroundColor?: string;
  children?: ReactNode;
}

const StyledBackgroundDiv = styled(({ backgroundColor, ...rest }) => <StyledPageWrapper {...rest} />)`
  ${({ backgroundColor }) => `background-color: ${backgroundColor}`}
`;

export const BackgroundDiv = ({ children, ...props }: BakcgroundDivProps) => {
  const darkMode = props.backgroundColor && isBackgroundColorDark(props.backgroundColor);

  return (
    <StyledBackgroundDiv {...props}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>{children}</ThemeProvider>
    </StyledBackgroundDiv>
  );
};

export const NewBackgroundDiv = ({ children, sx }: BoxProps) => (
  <Box
    sx={{ background: '#faf7f4', padding: '1rem 3rem', display: 'flex', flexDirection: 'column', gap: '2rem', ...sx }}>
    {children}
  </Box>
);

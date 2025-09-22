import { BoxProps, styled } from '@mui/material';
import { VerticalBox } from '../../components/styled/Wrappers';

export const FrontPageBox = styled(VerticalBox)<BoxProps>({
  gap: '0.75rem',
  width: '100%',
  borderRadius: '1rem',
  padding: '2rem 3rem',
});

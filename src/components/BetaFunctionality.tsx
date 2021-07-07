import { ReactNode } from 'react';
import styled from 'styled-components';

const StyledBetaBox = styled.div`
  border: 3px dashed;
`;

interface BetaFunctionalityProps {
  children: ReactNode;
}

export const BetaFunctionality = ({ children }: BetaFunctionalityProps) => {
  const betaEnabled = localStorage.getItem('beta') === 'true';
  return betaEnabled ? <StyledBetaBox>{children}</StyledBetaBox> : null;
};

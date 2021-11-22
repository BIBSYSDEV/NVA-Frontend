import styled from 'styled-components';
import { IsbnField } from './IsbnField';
import { TotalPagesField } from './TotalPagesField';

const StyledIsbnAndPages = styled.div`
  display: grid;
  column-gap: 1rem;
  grid-template-columns: 1fr 2fr;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-columns: 1fr;
  }
`;

export const IsbnAndPages = () => (
  <StyledIsbnAndPages>
    <IsbnField />
    <TotalPagesField />
  </StyledIsbnAndPages>
);

import styled from 'styled-components';

export const StyledGeneralInfo = styled.div`
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1rem;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.values.sm}px`}) {
    grid-template-columns: 1fr;
  }
`;

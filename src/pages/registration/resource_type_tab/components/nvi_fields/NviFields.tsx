import styled from 'styled-components';
import { OriginalResearchField } from './OriginalResearchField';
import { PeerReviewedField } from './PeerReviewedField';

const StyledRadioGroup = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-columns: 1fr;
    row-gap: 0.5rem;
  }

  // Style label/heading for Radio Group
  legend {
    font-size: 1.25rem;
    font-weight: 700;
  }
`;

export const NviFields = () => (
  <StyledRadioGroup>
    <PeerReviewedField />
    <OriginalResearchField />
  </StyledRadioGroup>
);

import React from 'react';
import { Accordion, AccordionProps } from '@material-ui/core';
import styled from 'styled-components';

const StyledRegistrationAccordion = styled(Accordion)`
  background: ${({ theme }) => theme.palette.background.default};
  border-width: 4px;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.values.md}px`}) {
    max-width: 90vw;
  }

  .MuiAccordionSummary-content {
    align-items: center;
    padding: 1rem 0;

    > :first-child {
      // Space between icon and title
      margin-right: 1rem;
    }

    .MuiSvgIcon-root {
      font-size: 4rem;
      @media (max-width: ${({ theme }) => `${theme.breakpoints.values.md}px`}) {
        display: none;
      }
    }
  }

  .MuiAccordionDetails-root {
    flex-direction: column;
    > :not(:first-child) {
      margin-top: 1rem;
    }
  }
`;

export const RegistrationAccordion = ({ children, ...props }: AccordionProps) => (
  <StyledRegistrationAccordion variant="outlined" square {...props}>
    {children}
  </StyledRegistrationAccordion>
);

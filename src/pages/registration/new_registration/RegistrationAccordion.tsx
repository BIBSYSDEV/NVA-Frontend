import React from 'react';
import { Accordion, AccordionProps } from '@material-ui/core';
import styled from 'styled-components';

const StyledRegistrationAccordion = styled(Accordion)`
  background: ${({ theme }) => theme.palette.background.default};
  border-width: 4px;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.values.md}px`}) {
    max-width: 90vw;
  }
`;

const RegistrationAccordion = ({ children, ...props }: AccordionProps) => (
  <StyledRegistrationAccordion variant="outlined" square {...props}>
    {children}
  </StyledRegistrationAccordion>
);

export default RegistrationAccordion;

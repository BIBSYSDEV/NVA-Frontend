import { AccordionDetails, AccordionDetailsProps } from '@material-ui/core';
import styled from 'styled-components';

const StyledAccordionDetails = styled(AccordionDetails)`
  flex-direction: column;
  > :not(:first-child) {
    margin-top: 1rem;
  }
`;

const RegistrationAccordionDetails = ({ children, ...props }: AccordionDetailsProps) => (
  <StyledAccordionDetails {...props}>{children}</StyledAccordionDetails>
);

export default RegistrationAccordionDetails;

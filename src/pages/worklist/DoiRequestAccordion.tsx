import React, { FC } from 'react';
import { Accordion, AccordionSummary, AccordionActions, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { DoiRequest } from '../../types/doiRequest.types';
import styled from 'styled-components';
import Label from '../../components/Label';

const StyledAccordionSummary = styled(AccordionSummary)`
  .MuiAccordionSummary-content {
    width: 100%;
    display: grid;
    grid-template-areas: 'status title creator';
    grid-template-columns: 1fr 13fr 3fr;
    grid-column-gap: 1rem;
  }
`;

const StyledStatus = styled(Label)`
  grid-area: status;
`;

const StyledTitle = styled(Label)`
  grid-area: title;
`;
const StyledOwner = styled(Label)`
  word-break: break-word;
  grid-area: creator;
`;

interface DoiRequestAccordionProps {
  doiRequest: DoiRequest;
}

export const DoiRequestAccordion: FC<DoiRequestAccordionProps> = ({ doiRequest }) => {
  return (
    <Accordion>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <StyledStatus>{doiRequest.doiRequestStatus}</StyledStatus>
        <StyledTitle>{doiRequest.publicationTitle}</StyledTitle>
        <StyledOwner>
          {doiRequest.publicationCreator}
          <br />
          {doiRequest.doiRequestDate}
        </StyledOwner>
      </StyledAccordionSummary>
      <AccordionDetails></AccordionDetails>
      <AccordionActions></AccordionActions>
    </Accordion>
  );
};

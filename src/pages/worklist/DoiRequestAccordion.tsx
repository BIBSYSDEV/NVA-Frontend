import React, { FC } from 'react';
import { Accordion, AccordionSummary, AccordionActions, AccordionDetails, Button } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link as RouterLink } from 'react-router-dom';

import { DoiRequest } from '../../types/doiRequest.types';
import styled from 'styled-components';
import Label from '../../components/Label';
import { useTranslation } from 'react-i18next';
import { PublicationTab } from '../../types/publication.types';

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
  const { t } = useTranslation('workLists');

  return (
    <Accordion data-testid={`doi-request-${doiRequest.publicationIdentifier}`}>
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
      <AccordionActions>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to={`/publication/${doiRequest.publicationIdentifier}?tab=${PublicationTab.Submission}`}>
          {t('go_to_publication')}
        </Button>
      </AccordionActions>
    </Accordion>
  );
};

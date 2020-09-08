import React, { FC } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, TextField } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';

import { DoiRequest } from '../../types/doiRequest.types';
import Label from '../../components/Label';
import { useTranslation } from 'react-i18next';
import { PublicationTab } from '../../types/publication.types';

const StyledAccordion = styled(Accordion)`
  .MuiAccordionSummary-content {
    display: grid;
    grid-template-areas: 'status title creator';
    grid-template-columns: 1fr 13fr 3fr;
    grid-column-gap: 1rem;
  }

  .MuiAccordionDetails-root {
    justify-content: space-between;
  }
`;

const StyledStatus = styled(Label)`
  grid-area: status;
`;

const StyledTitle = styled(Label)`
  grid-area: title;
`;

const StyledOwner = styled.div`
  word-break: break-word;
  grid-area: creator;
`;

const StyledMessages = styled.div`
  width: 75%;
  flex-direction: column;
`;

const StyledMessageButton = styled(Button)`
  margin-top: 1rem;
  float: right;
  min-width: 10rem;
`;

const StyledAccordionActionButtons = styled.div`
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  button,
  a {
    width: 100%;
    :last-child {
      margin-top: 1rem;
    }
  }
`;

interface DoiRequestAccordionProps {
  doiRequest: DoiRequest;
}

export const DoiRequestAccordion: FC<DoiRequestAccordionProps> = ({ doiRequest }) => {
  const { t } = useTranslation('workLists');

  return (
    <StyledAccordion data-testid={`doi-request-${doiRequest.publicationIdentifier}`}>
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <StyledStatus>{doiRequest.doiRequestStatus}</StyledStatus>
        <StyledTitle>{doiRequest.publicationTitle}</StyledTitle>
        <StyledOwner>
          <Label>{doiRequest.publicationCreator}</Label>
          {doiRequest.doiRequestDate}
        </StyledOwner>
      </AccordionSummary>
      <AccordionDetails>
        <StyledMessages>
          <TextField
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            label={t('doi_requests.message_to_user')}
            disabled
          />
          <StyledMessageButton variant="contained" color="primary" disabled>
            {t('common:send')}
          </StyledMessageButton>
        </StyledMessages>
        <StyledAccordionActionButtons>
          <Button
            data-testid={`go-to-publication-${doiRequest.publicationIdentifier}`}
            variant="outlined"
            component={RouterLink}
            to={`/publication/${doiRequest.publicationIdentifier}?tab=${PublicationTab.Submission}`}>
            {t('doi_requests.go_to_publication')}
          </Button>
          <Button variant="contained" color="primary" disabled>
            {t('doi_requests.archive')}
          </Button>
        </StyledAccordionActionButtons>
      </AccordionDetails>
    </StyledAccordion>
  );
};

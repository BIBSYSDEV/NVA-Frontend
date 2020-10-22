import React, { FC } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, TextField } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Label from '../../components/Label';
import { RegistrationTab, Registration } from '../../types/registration.types';
import MessageList from './MessageList';

const StyledAccordion = styled(Accordion)`
  width: 100%;
  margin: 0 1rem;
  .MuiAccordionSummary-content {
    display: grid;
    grid-template-areas: 'status title creator';
    grid-template-columns: 1fr 5fr 1fr;
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
  registration: Registration;
}

export const DoiRequestAccordion: FC<DoiRequestAccordionProps> = ({ registration }) => {
  const { t } = useTranslation('workLists');
  const {
    identifier,
    owner,
    entityDescription: { mainTitle },
  } = registration;
  const doiRequest = registration.doiRequest!;

  return (
    <StyledAccordion data-testid={`doi-request-${identifier}`}>
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <StyledStatus>{t(`doi_requests.status.${doiRequest.status}`)}</StyledStatus>
        <StyledTitle>{mainTitle}</StyledTitle>
        <StyledOwner>
          <Label>{owner}</Label>
          {new Date(doiRequest.date).toLocaleDateString()}
        </StyledOwner>
      </AccordionSummary>
      <AccordionDetails>
        <StyledMessages>
          <MessageList messages={doiRequest.messages} />
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
            data-testid={`go-to-publication-${identifier}`}
            variant="outlined"
            component={RouterLink}
            to={`/registration/${identifier}?tab=${RegistrationTab.Submission}`}>
            {t('doi_requests.go_to_registration')}
          </Button>
          <Button variant="contained" color="primary" disabled>
            {t('doi_requests.archive')}
          </Button>
        </StyledAccordionActionButtons>
      </AccordionDetails>
    </StyledAccordion>
  );
};

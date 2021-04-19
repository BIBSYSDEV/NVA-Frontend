import React, { useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { AccordionActions, AccordionDetails, AccordionSummary, Button, Typography } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useDispatch } from 'react-redux';

import { getRegistrationByDoi } from '../../../api/registrationApi';
import LinkRegistrationForm from './LinkRegistrationForm';
import RegistrationAccordion from './RegistrationAccordion';
import { Doi } from '../../../types/registration.types';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import { getRegistrationPath } from '../../../utils/urlPaths';

const StyledRegistrationAccorion = styled(RegistrationAccordion)`
  border-color: ${({ theme }) => theme.palette.primary.main};
`;

interface LinkRegistrationProps {
  expanded: boolean;
  onChange: (event: ChangeEvent<unknown>, isExpanded: boolean) => void;
}

const LinkRegistration = ({ expanded, onChange }: LinkRegistrationProps) => {
  const { t } = useTranslation('common');
  const [doi, setDoi] = useState<Doi | null>(null);
  const [noHit, setNoHit] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const createRegistration = async () => {
    if (!doi) {
      return;
    }
    history.push(getRegistrationPath(doi.identifier), { highestValidatedTab: -1 });
  };

  const handleSearch = async (doiUrl: string) => {
    setNoHit(false);
    setDoi(null);

    const doiRegistration = await getRegistrationByDoi(doiUrl);
    if (doiRegistration?.error) {
      setNoHit(true);
      dispatch(setNotification(t('feedback:error.get_doi'), NotificationVariant.Error));
    } else if (!doiRegistration) {
      setNoHit(true);
    } else {
      setDoi(doiRegistration);
    }
  };

  return (
    <StyledRegistrationAccorion expanded={expanded} onChange={onChange}>
      <AccordionSummary data-testid="new-registration-link" expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <LinkIcon />
        <div>
          <Typography variant="h2">{t('registration:registration.start_with_link_to_resource_title')}</Typography>
          <Typography>{t('registration:registration.start_with_link_to_resource_description')}</Typography>
        </div>
      </AccordionSummary>

      <AccordionDetails>
        <LinkRegistrationForm handleSearch={handleSearch} />
        {noHit && <Typography>{t('no_hits')}</Typography>}
        {doi && (
          <div data-testid="link-metadata">
            <Typography variant="subtitle1">{t('registration')}:</Typography>
            <Typography>{doi.title}</Typography>
          </div>
        )}
      </AccordionDetails>

      <AccordionActions>
        <Button
          data-testid="registration-link-next-button"
          endIcon={<ArrowForwardIcon fontSize="large" />}
          color="secondary"
          variant="contained"
          disabled={!doi}
          onClick={createRegistration}>
          {t('registration:registration.start_registration')}
        </Button>
      </AccordionActions>
    </StyledRegistrationAccorion>
  );
};

export default LinkRegistration;
